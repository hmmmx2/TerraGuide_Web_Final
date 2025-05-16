@echo off
echo ===================================================
echo TerraGuide Debug Mode
echo ===================================================

:: Check if model files exist
echo [DEBUG] Checking for model files...
if not exist "backend\plant_api\identify_plant.pth" (
    echo [DEBUG] identify_plant.pth not found! Running installation...
    call install_and_run.bat
) else if not exist "backend\plant_api\class_names.json" (
    echo [DEBUG] class_names.json not found! Running installation...
    call install_and_run.bat
) else (
    echo [DEBUG] All model files found. Starting backend...
    call start_backend.bat
)

:: Start frontend after backend
npx vite