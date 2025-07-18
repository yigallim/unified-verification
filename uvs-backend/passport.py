from openai import OpenAI
from pydantic import BaseModel
from datetime import date
from typing import Dict
from dotenv import load_dotenv
import os
import json

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class PassportData(BaseModel):
    name: str
    dob: date
    license_no: str
    business_name: str
    business_reg_no: str
    address: str 

def extract_passport_data_from_dicts(license_data: Dict, ssm_data: Dict) -> PassportData:
    """
    Uses OpenAI GPT to match arbitrary OCR keys to PassportData fields.
    """
    merged = {**license_data, **ssm_data}

    prompt = f"""
You are a smart JSON key-mapper.

Given this unstructured OCR result:
{json.dumps(merged, indent=2)}

Map and return the following structure with best-effort matching:
{{
  "name": "person's full name",
  "dob": "date of birth in YYYY-MM-DD format",
  "license_no": "driver's license or ID number",
  "business_name": "registered business name",
  "business_reg_no": "business registration number",
  "address": "business or residential address"
}}

Guidelines:
- If "identification_number" is available in Malaysian IC format (e.g. "991231141234"), extract "dob" from the first 6 digits:
  - Format: YYMMDD
  - Years 00-24 → 2000-2024
  - Years 25-99 → 1925-1999
  - Output format: YYYY-MM-DD

Only return valid JSON with the exact 6 keys.
"""
    
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "You convert raw OCR key-value pairs into structured JSON fields."},
            {"role": "user", "content": prompt}
        ],
        temperature=0,
        max_tokens=500
    )

    content = response.choices[0].message.content

    try:
        parsed = json.loads(content)
        return PassportData(**parsed)
    except Exception as e:
        raise ValueError(f"Failed to parse PassportData from LLM output. Error: {e}\nRaw content: {content}")
