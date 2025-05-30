import cv2
import time
import uuid
import json
import os
import ssl
import torch
import paho.mqtt.client as mqtt
from datetime import datetime, timezone
from pathlib import Path
from supabase import create_client, Client


# Directory to save captured images
SAVE_DIR = Path(r"C:\Users\USER\Downloads\img")
SAVE_DIR.mkdir(parents=True, exist_ok=True)
os.startfile(str(SAVE_DIR))  # Optional: Open the folder

# Hivemq Configuration
# MQTT_BROKER = "458fd3330efa41cf8790c83f863722e3.s1.eu.hivemq.cloud" Chin
MQTT_BROKER = "63137476d2b8426e8e380ecebebc1caa.s1.eu.hivemq.cloud"  # Desmond

MQTT_PORT = 8883
MQTT_TOPIC = "iot/innocation/ultrasonic_01"
MQTT_USERNAME = "user1"
MQTT_PASSWORD = "User1@password"

# Supabase Configuration
SUPABASE_URL = "https://wxvnjjxbvbevwmvqyack.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm5qanhidmJldndtdnF5YWNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjIwNjIwMCwiZXhwIjoyMDYxNzgyMjAwfQ.9KKYFmxQH3eXW8TFONRsNXWw5Rw6_Fdpg43DLTmWVcw"
SUPABASE_BUCKET = "intruderimage"

supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Load YOLOv5 model once
print("Loading YOLOv5 model...")
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
model.conf = 0.25  # Confidence threshold
print("YOLOv5 model loaded.")

# Capture image, then detect human, then save if detected
def capture_image_and_upload(distance):
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Failed to open webcam.")
        return

    ret, frame = cap.read()
    cap.release()

    if not ret:
        print("Failed to capture image.")
        return

    print("Running human detection...")
    results = model(frame)
    df = results.pandas().xyxy[0]
    humans = df[df['name'] == 'person']

    if humans.empty:
        print("No human detected in image. Skipping save.")
        return
    else:
        print("Human detected! Saving image and logging...")

    # Save image locally
    filename = f"image_{uuid.uuid4()}.jpg"
    filepath = SAVE_DIR / filename
    if cv2.imwrite(str(filepath), frame):
        print(f"Image saved: {filepath}")
    else:
        print("Failed to save image.")
        return

    # Upload image to Supabase Storage
    # Define this function once, ideally in a utility module
    def upload_to_supabase(bucket_name, image_key, file_data, supabase_client):
        try:
            response = supabase_client.storage.from_(bucket_name).upload(image_key, file_data)
            print("Upload response:", response)  # 👈 Debugging line

            if isinstance(response, tuple):
                data, error = response
                if error:
                    raise Exception(error.get('message', str(error)))
                return image_key  

            elif isinstance(response, dict):
                if response.get("error"):
                    raise Exception(response["error"].get('message', str(response["error"])))
                return image_key  

            elif hasattr(response, 'json'):
                # json_data = response.json()
                # if json_data.get("error"):
                #     raise Exception(json_data["error"].get("message", str(json_data["error"])))
                # return image_key
                return response.path
            else:
                raise Exception("Unknown response format from Supabase upload.")
        except Exception as e:
            raise Exception(f"Failed to upload image to Supabase: {e}")

    # Use the function like this in your main code:
    image_key = f"images/{filename}"
    try:
        with open(filepath, 'rb') as f:
            file_data = f.read()

            image_url = upload_to_supabase("intruderimage", image_key, file_data, supabase_client)
            print(f"Image uploaded to Supabase: {image_url}")
    except Exception as e:
        print(e)

    # Insert metadata into Supabase Postgres database
    try:
        data = {
            "title": "Intrusion Approaching To The Restricted Area",
            "detection_time": datetime.now(timezone.utc).isoformat(),
            "distance_cm": int(distance),
            "image_url": f"{SUPABASE_URL}/storage/v1/object/public/intruderimage/{image_key}",
        }
        
        # Insert data into the database
        response = supabase_client.table("intruder_detection_events").insert(data).execute()
        print("Metadata inserted into Supabase:", response.data)

    except Exception as e:
        print(f"Failed to insert metadata into Supabase: {e}")

    # Log detection locally (optional)
    log = {
        "distance": distance,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "filename": str(filename),
        "status": "human_detected"
    }
    with open(SAVE_DIR / "log.json", "a") as f:
        f.write(json.dumps(log) + "\n")

# MQTT Connect callback
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to HiveMQ Cloud")
        client.subscribe(MQTT_TOPIC)
    else:
        print("Failed to connect with code", rc)

# MQTT Message callback
def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        distance = float(payload.get("distance", 0))
        print(f"Received distance: {distance} cm → capturing image...")
        capture_image_and_upload(distance)
    except Exception as e:
        print("Error processing message:", e)

# MQTT Client setup
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.tls_set(cert_reqs=ssl.CERT_REQUIRED)
client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)

# Start MQTT loop
client.connect(MQTT_BROKER, MQTT_PORT, 60)
client.loop_forever()
