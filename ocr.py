from openai import OpenAI
from dotenv import load_dotenv
import easyocr
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Step 1: OCR
reader = easyocr.Reader(['en'])
results = reader.readtext('SSM sample.jpg')
text = "\n".join([line[1] for line in results])

# Step 2: Prompt LLM
prompt = f"""
Extract the following fields from this certificate text and return a valid JSON object:

Text:
{text}
"""

client = OpenAI(api_key=api_key)

response = client.chat.completions.create(
    model="gpt-4.1-mini",
    messages=[
        {
            "role": "system",
            "content": "You are a document parser that extracts structured fields from certificates."
        },
        {
            "role": "user",
            "content": prompt
        }
    ],
    max_tokens=1000
)

print(response.choices[0].message.content)
