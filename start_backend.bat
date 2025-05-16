@echo off
echo ===================================================
echo TerraGuide Plant Identification API
echo ===================================================

:: Check if backend/plant_api directory exists, create if not
if not exist "backend\plant_api" (
    echo Creating backend\plant_api directory...
    mkdir "backend\plant_api"
)

:: Check if model files exist directly in the plant_api directory
if not exist "backend\plant_api\identify_plant.pth" (
    echo Model files not found in plant_api directory.
    echo Please run install_and_run.bat first to download the models.
    exit /b 1
)

:: Activate the virtual environment if it exists
if exist "backend\plant_api\venv" (
    call backend\plant_api\venv\Scripts\activate.bat
)

cd backend\plant_api
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
:: python main.py
