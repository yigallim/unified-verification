from fastapi import FastAPI, UploadFile, File, WebSocket
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from ocr import doc_to_json
import asyncio
import uuid
import os
from pydantic import BaseModel
from datetime import date
from passport import extract_passport_data_from_dicts

app = FastAPI()


class PassportData(BaseModel):
    name: str
    dob: date
    license_no: str
    business_name: str
    business_reg_no: str
    address: str 

# Optional: Allow frontend from any origin (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"

@app.post("/upload-docs")
async def upload_docs(
    license: UploadFile = File(...),
    ssm: UploadFile = File(...)
):
    # Generate UUID filenames while preserving the original extension
    license_ext = os.path.splitext(license.filename)[1]
    ssm_ext = os.path.splitext(ssm.filename)[1]
    
    license_uuid = f"{uuid.uuid4()}{license_ext}"
    ssm_uuid = f"{uuid.uuid4()}{ssm_ext}"
    
    license_path = os.path.join(UPLOAD_DIR, license_uuid)
    ssm_path = os.path.join(UPLOAD_DIR, ssm_uuid)

    # Save files to disk
    with open(license_path, "wb") as f:
        f.write(await license.read())
    with open(ssm_path, "wb") as f:
        f.write(await ssm.read())

    return {
        "message": "Files uploaded and saved successfully!",
        "license_file": license_uuid,
        "ssm_file": ssm_uuid
    }


@app.websocket("/ws/verification")
async def verification_ws(websocket: WebSocket):
    await websocket.accept()

    # Step 0: Receive file names from frontend
    init_data = await websocket.receive_json()
    license_file = init_data.get("license_file")
    ssm_file = init_data.get("ssm_file")

    if not license_file or not ssm_file:
        await websocket.send_json({"step": -1, "message": "Missing file names"})
        await websocket.close()
        return

    license_path = os.path.join(UPLOAD_DIR, license_file)
    ssm_path = os.path.join(UPLOAD_DIR, ssm_file)

    # Step 1: Notify docs received
    await websocket.send_json({"step": 0, "message": "Docs Received"})
    await asyncio.sleep(0.5)
    # Step 2: OCR Processing (simulate + real OCR)
    await websocket.send_json({"step": 1, "message": "OCR Processing"})
    try:
        license_data = doc_to_json(license_path)
        ssm_data = doc_to_json(ssm_path)
    except Exception as e:
        await websocket.send_json({"step": -2, "message": f"OCR Failed: {str(e)}"})
        await websocket.close()
        return

    # Step 3: Verifying Data
    await websocket.send_json({"step": 2, "message": "Verifying Data"})
    await asyncio.sleep(0.5)

    passport_data = extract_passport_data_from_dicts(license_data, ssm_data)
    # Step 4: Send result
    await websocket.send_json({
        "step": 3,
        "message": "Verified!",
        "license_data": license_data,
        "ssm_data": ssm_data,
        "passport_data": jsonable_encoder(passport_data)
    })

    await websocket.close()
