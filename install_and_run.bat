@echo off
echo ===================================================
echo TerraGuide Plant Identification Model Installation
echo ===================================================

:: Create a Python virtual environment if it doesn't exist
if not exist "backend\plant_api\venv" (
    echo Creating Python virtual environment...
    cd backend\plant_api
    python -m venv venv
    cd ..\..
)

:: Activate the virtual environment
echo Activating virtual environment...
call backend\plant_api\venv\Scripts\activate.bat

:: Install required packages
echo Installing required packages...
pip install requests tqdm fastapi uvicorn python-multipart pillow torch torchvision

:: Create download_model.py script if it doesn't exist
if not exist "backend\plant_api\download_model.py" (
    echo Creating model download script...
    (
        echo import os
        echo import requests
        echo import sys
        echo from tqdm import tqdm
        echo.
        echo def download_file_from_google_drive^(file_id, destination^):
        echo     """
        echo     Download a file from Google Drive using the file ID
        echo     """
        echo     if os.path.exists^(destination^):
        echo         print^(f"File already exists: {destination}"^)
        echo         return True
        echo.    
        echo     try:
        echo         # Google Drive API endpoint
        echo         url = f"https://drive.google.com/uc?export=download&id={file_id}"
        echo         
        echo         # For large files, we need to handle the confirmation page
        echo         session = requests.Session^(^)
        echo         response = session.get^(url, stream=True^)
        echo         
        echo         # Check if there's a download warning (for large files^)
        echo         for key, value in response.cookies.items^(^):
        echo             if key.startswith^('download_warning'^):
        echo                 url = f"{url}&confirm={value}"
        echo                 response = session.get^(url, stream=True^)
        echo                 break
        echo.        
        echo         # Create directory if it doesn't exist
        echo         os.makedirs^(os.path.dirname^(destination^), exist_ok=True^)
        echo.        
        echo         # Get file size for progress bar if available
        echo         total_size = int^(response.headers.get^('content-length', 0^)^)
        echo.        
        echo         # Download with progress bar
        echo         print^(f"Downloading {os.path.basename^(destination^)}..."^)
        echo         with open^(destination, 'wb'^) as f, tqdm^(
        echo             desc=os.path.basename^(destination^),
        echo             total=total_size,
        echo             unit='B',
        echo             unit_scale=True,
        echo             unit_divisor=1024,
        echo         ^) as bar:
        echo             for chunk in response.iter_content^(chunk_size=1024*1024^):
        echo                 if chunk:  # filter out keep-alive chunks
        echo                     size = f.write^(chunk^)
        echo                     bar.update^(size^)
        echo.        
        echo         print^(f"Download complete: {destination}"^)
        echo         return True
        echo.    
        echo     except Exception as e:
        echo         print^(f"Error downloading file: {str^(e^)}"^)
        echo         return False
        echo.
        echo def main^(^):
        echo     # Replace these file IDs with the actual file IDs from your Google Drive
        echo     # You can get the file ID from the sharing link:
        echo     # https://drive.google.com/file/d/FILE_ID_HERE/view?usp=sharing
        echo     model_files = {
        echo         "identify_plant.pth": "17Ve1cgRs965lbyPbkgj31l1j6f9pEQ8g",
        echo         "class_names.json": "1mg9xkLc7ARhc616oYn5fxqGnB0GFqJri"
        echo     }
        echo.    
        echo     # Create models directory if it doesn't exist
        echo     os.makedirs^("models", exist_ok=True^)
        echo.    
        echo     # Download each file
        echo     success = True
        echo     for filename, file_id in model_files.items^(^):
        echo         destination = os.path.join^("models", filename^) if filename != "class_names.json" else filename
        echo         if not download_file_from_google_drive^(file_id, destination^):
        echo             success = False
        echo.    
        echo     if success:
        echo         print^("\nAll model files downloaded successfully!"^)
        echo         return 0
        echo     else:
        echo         print^("\nSome files failed to download. Please check the errors above."^)
        echo         return 1
        echo.
        echo if __name__ == "__main__":
        echo     sys.exit^(main^(^)^)
    ) > backend\plant_api\download_model.py
)

:: Run the download script
echo Downloading model files...
cd backend\plant_api
python download_model.py
cd ..\..

:: Check if download was successful
if %ERRORLEVEL% NEQ 0 (
    echo Failed to download model files. Please check your internet connection.
    echo Make sure to update the file IDs in download_model.py with your actual Google Drive file IDs.
    exit /b 1
)

:: Start the backend server
echo.
echo ===================================================
echo Starting the TerraGuide Plant Identification API...
echo ===================================================
call start_backend.bat