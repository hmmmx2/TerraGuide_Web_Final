#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "esp_system.h"  // Add this at the top of your sketch

// ========== WiFi credentials ==========
//const char* ssid = "desmondc1102";
//const char* password = "041102130975c";
const char* ssid = "CSJ";
const char* password = "1wdcvfe234rfv";

// ========== HiveMQ Cloud ==========
const char* mqtt_server = "63137476d2b8426e8e380ecebebc1caa.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_topic = "iot/innocation/ultrasonic_01";
const char* mqtt_client_id = "esp32_ultrasonic_01";

// Optional: Basic Auth credentials
const char* mqtt_username = "user1";
const char* mqtt_password = "User1@password";

// ========== Hardware Pins ==========
#define TRIG_PIN 18
#define ECHO_PIN 27
#define LED_PIN 5

// ========== Settings ==========
#define MAX_DISTANCE 400       // cm
#define TRIGGER_DISTANCE 100   // cm
#define MEASURE_INTERVAL 1000  // ms
#define MQTT_COOLDOWN 3000     // ms - 3 second cooldown between MQTT publishes

// ========== Globals ==========
WiFiClientSecure espClient;
PubSubClient client(espClient);
unsigned long lastMeasurement = 0;
unsigned long lastTriggerTime = 0;
bool objectDetected = false;

// ========== Setup ==========
void setup() {
  Serial.begin(115200);
  while (!Serial)
    ;

  setupHardware();
  setupWiFi();
  setupMQTT();

  Serial.print("Reset reason: ");
  Serial.print("Reset reason: ");
  esp_reset_reason_t reason = esp_reset_reason();
  Serial.println((int)reason);
}

// ========== Hardware Setup ==========
void setupHardware() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
}

// ========== WiFi Setup ==========
void setupWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n WiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ Failed to connect to WiFi.");
    // Optionally restart or deep sleep
  }
}

// ========== MQTT Setup ==========
void setupMQTT() {
  espClient.setInsecure();  // Disable SSL verification (for testing only)
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(NULL);  // No subscriptions in this setup
}

// ========== Main Loop ==========
void loop() {
  // Reconnect WiFi if disconnected
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected! Reconnecting...");
    setupWiFi();
  }

  // Reconnect to MQTT if needed
  if (!client.connected()) {
    reconnectMQTT();
  }
  client.loop();

  // Measure distance periodically
  if (millis() - lastMeasurement >= MEASURE_INTERVAL) {
    lastMeasurement = millis();
    checkDistanceAndTrigger();
  }
}

// ========== Distance Logic ==========
void checkDistanceAndTrigger() {
  float distance = getDistance();
  if (distance <= 0) return;

  Serial.printf("Distance: %.2f cm\n", distance);

  if (distance < TRIGGER_DISTANCE) {
    digitalWrite(LED_PIN, HIGH);
    objectDetected = true;

    // Only publish if cooldown period has passed
    if (millis() - lastTriggerTime >= MQTT_COOLDOWN) {
      publishDistance(distance);
      lastTriggerTime = millis();
    }
  } else {
    digitalWrite(LED_PIN, LOW);
    objectDetected = false;
  }
}

// ========== Ultrasonic Sensor ==========
float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);  // 30 ms timeout
  Serial.printf("Raw pulse duration: %ld us\n", duration);
  if (duration <= 0) {
    Serial.println("No object detected!");
    return -1.0;
  }

  float dist = duration * 0.034 / 2;
  Serial.printf("Distance: %.2f cm\n", dist);
  return dist;
}

// ========== MQTT Publish ==========
void publishDistance(float distance) {
  char payload[128];
  snprintf(payload, sizeof(payload),
           "{\"distance\":%.2f,\"unit\":\"cm\",\"sensor\":\"HC-SR04\"}",
           distance);

  if (client.publish(mqtt_topic, payload)) {
    Serial.println("MQTT Published");
  } else {
    Serial.println("❌ MQTT Publish Failed");
  }
}

// ========== MQTT Reconnect ==========
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Connecting to HiveMQ,MQTT...");
    if (client.connect(mqtt_client_id, mqtt_username, mqtt_password)) {
      Serial.println("connected ✅");
    } else {
      Serial.print("failed (rc=");
      Serial.print(client.state());
      Serial.println("). Retrying in 2s...");
      delay(2000);
    }
  }
}
