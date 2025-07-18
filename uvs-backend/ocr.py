from openai import OpenAI
from dotenv import load_dotenv
import easyocr
import os
import json

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)
reader = easyocr.Reader(['en'])

def doc_to_json(image_path: str) -> dict:
    results = reader.readtext(image_path)
    text = "\n".join([line[1] for line in results])

    prompt = f"""
    You are an AI document parser.
    Extract and return the following fields as a valid JSON object. **Respond with pure JSON only. Do not include markdown, code blocks, or any explanations.**

    Text:
    {text}
    """

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

    content = response.choices[0].message.content
    print(content)
    return json.loads(content) 