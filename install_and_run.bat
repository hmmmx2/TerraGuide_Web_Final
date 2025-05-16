@echo off
echo ===================================================
echo TerraGuide Plant Identification Model Installation
echo ===================================================

echo [DEBUG] Starting installation process...

:: Create a Python virtual environment if it doesn't exist
if not exist "backend\plant_api\venv" (
    echo Creating Python virtual environment...
    cd backend\plant_api
    python -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to create Python virtual environment. Please check if Python is installed correctly.
        exit /b 1
    )
    cd ..\..
)

:: Activate the virtual environment
echo Activating virtual environment...
call backend\plant_api\venv\Scripts\activate.bat
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to activate virtual environment. Please check if it was created correctly.
    exit /b 1
)

:: Install required packages
echo Installing required packages...
pip install -r backend\plant_api\requirement.txt
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install required packages. Please check your internet connection.
    exit /b 1
)

:: Create download_model.py using a temporary file approach
echo [DEBUG] Creating download_model.py script...
echo Creating model download script...

:: Create a temporary file with the Python script content
echo import os > temp_script.py
echo import requests >> temp_script.py
echo import sys >> temp_script.py
echo import gdown >> temp_script.py
echo from tqdm import tqdm >> temp_script.py
echo. >> temp_script.py
echo def download_file_from_google_drive(file_id, destination): >> temp_script.py
echo     """Download a file from Google Drive using the file ID""" >> temp_script.py
echo     if os.path.exists(destination): >> temp_script.py
echo         print(f"File already exists: {destination}") >> temp_script.py
echo         return True >> temp_script.py
echo. >> temp_script.py
echo     try: >> temp_script.py
echo         # Only try to create directory if there's actually a directory path >> temp_script.py
echo         dirname = os.path.dirname(destination) >> temp_script.py
echo         if dirname:  # Only create directories if there's a path component >> temp_script.py
echo             os.makedirs(dirname, exist_ok=True) >> temp_script.py
echo. >> temp_script.py
echo         # Download with gdown >> temp_script.py
echo         print(f"Downloading {os.path.basename(destination)}...") >> temp_script.py
echo         url = f"https://drive.google.com/uc?id={file_id}" >> temp_script.py
echo         gdown.download(url, destination, quiet=False) >> temp_script.py
echo         print(f"Download complete: {destination}") >> temp_script.py
echo         return True >> temp_script.py
echo. >> temp_script.py
echo     except Exception as e: >> temp_script.py
echo         print(f"Error downloading file: {str(e)}") >> temp_script.py
echo         return False >> temp_script.py
echo. >> temp_script.py
echo def main(): >> temp_script.py
echo     # File IDs from Google Drive >> temp_script.py
echo     model_files = { >> temp_script.py
echo         "identify_plant.pth": "17Ve1cgRs965lbyPbkgj31l1j6f9pEQ8g", >> temp_script.py
echo         "class_names.json": "1mg9xkLc7ARhc616oYn5fxqGnB0GFqJri" >> temp_script.py
echo     } >> temp_script.py
echo. >> temp_script.py
echo     # Download each file >> temp_script.py
echo     success = True >> temp_script.py
echo     for filename, file_id in model_files.items(): >> temp_script.py
echo         destination = filename >> temp_script.py
echo         print(f"[DEBUG] Attempting to download {filename}...") >> temp_script.py
echo         if not download_file_from_google_drive(file_id, destination): >> temp_script.py
echo             success = False >> temp_script.py
echo             print(f"[DEBUG] Failed to download {filename}") >> temp_script.py
echo         else: >> temp_script.py
echo             print(f"[DEBUG] Successfully downloaded {filename}") >> temp_script.py
echo. >> temp_script.py
echo     if success: >> temp_script.py
echo         print("\nAll model files downloaded successfully!") >> temp_script.py
echo         return 0 >> temp_script.py
echo     else: >> temp_script.py
echo         print("\nSome files failed to download. Please check the errors above.") >> temp_script.py
echo         return 1 >> temp_script.py
echo. >> temp_script.py
echo if __name__ == "__main__": >> temp_script.py
echo     sys.exit(main()) >> temp_script.py

:: Move the temporary file to the correct location
if not exist "backend\plant_api" mkdir "backend\plant_api"
move /Y temp_script.py backend\plant_api\download_model.py
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to create download_model.py script. Please check file permissions.
    exit /b 1
)

:: Run the download script
echo Downloading model files...
cd backend\plant_api
python download_model.py
set DOWNLOAD_RESULT=%ERRORLEVEL%
cd ..\..

:: Check if download was successful
if %DOWNLOAD_RESULT% NEQ 0 (
    echo [ERROR] Failed to download model files. Please check your internet connection.
    echo Make sure to update the file IDs in download_model.py with your actual Google Drive file IDs.
    exit /b 1
)

:: Verify model files exist after download
echo [DEBUG] Verifying model files after download...
if not exist "backend\plant_api\identify_plant.pth" (
    echo [DEBUG] ERROR: identify_plant.pth still not found after download!
    echo Failed to download identify_plant.pth. Please check the download script.
    exit /b 1
)

if not exist "backend\plant_api\class_names.json" (
    echo [DEBUG] ERROR: class_names.json still not found after download!
    echo Failed to download class_names.json. Please check the download script.
    exit /b 1
)

echo [DEBUG] All model files verified successfully!

:: Start the backend server
echo.
echo ===================================================
echo Starting the TerraGuide Plant Identification API...
echo ===================================================
call start_backend.bat