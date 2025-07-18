## Features

This project showcases a complete user journey through two distinct demos, toggled at the top of the screen:

1.  **UVS Identity App:** A mobile-first onboarding flow where an MSME owner creates their secure, verified digital identity by uploading their documents.
2.  **Partner Demo (Maybank):** A simulation of a partner's website, showing how a user can instantly apply for a service (like FPX) with a single click using their UVS Passport, eliminating the need for repetitive form-filling.

---

## 🚀 Getting Started: Running the UI Locally

To run this project on your machine, follow these steps.

1.  **Navigate to the project folder:**
    ```bash
    cd uvs-frontend
    ```

2.  **Install all the necessary dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open your browser:** The application will be running live at `http://localhost:5173`. Any changes you make to the code will update the page automatically.

---

## 🔌 Integration Guide for the OCR

Your goal is to replace the simulated data in the frontend with live data from your OCR and identity services. Here’s exactly how our parts connect.

### There are TWO key integration points:

---

### Integration Point #1: The Initial Document Upload

This is where the user submits their documents, and your OCR service needs to process them and return a verified passport.

*   **File to Modify:** `src/components/UploadForm.jsx`
*   **Function to Focus On:** `handleSubmit`

Inside the `handleSubmit` function, you will see a block labeled `--- SIMULATED BACKEND CALL ---`.

**Your Task:**
1.  **Delete** or **comment out** the entire `setTimeout` block.
2.  **Uncomment** the block below it, labeled `--- REAL AXIOS CALL ---`.
3.  **Update the Endpoint:** Change the URL `'http://localhost:3001/upload'` to match the real endpoint of your backend server.

**Expected API Response Structure:**

When our frontend sends the files to your `/upload` endpoint, it expects a JSON response back. For the UI to work correctly, the structure of this JSON object **must** match the following format:

```json
{
  "uid": "u-1022",
  "name": "Azlan Bin Ahmad",
  "dob": "1990-01-01",
  "license_no": "D12345678",
  "business": {
    "name": "Azlan's Warung",
    "reg_no": "SSM2020-123456"
  },
  "status": "verified",
  "passport": {
    "age_verified": true,
    "business_verified": true,
    "photo_verified": false
  }
}```

This JSON object is then passed to the `DigitalPassport.jsx` component to display the results.

---

### Integration Point #2: The "Apply with UVS" Magic

This is where a partner (Maybank) fetches the user's verified data after they consent.

*   **File to Modify:** `src/components/PartnerDemo.jsx`

At the top of this file, you will see a constant variable named `uvsVerifiedData`. This is the hardcoded data that currently populates the Maybank form.

**Your Task:**
In a real-world scenario, the `handleApplyWithUVS` function would make an API call to your backend. Your backend would then fetch the user's data (using their UID from a login session), decrypt it, and send it back to the frontend.

For the hackathon, you need to replace the hardcoded `uvsVerifiedData` constant with data fetched from your service.

**Expected Data Structure:**

When the frontend asks for the user's data to auto-fill the form, the JSON object returned from your service **must** have this structure:

```json
{
  "name": "Azlan Bin Ahmad",
  "business": {
    "name": "Azlan's Warung",
    "reg_no": "SSM2020-123456",
    "address": "123 Jalan Niaga, 50450 Kuala Lumpur",
    "type": "Sole Proprietorship",
    "branch": "KL Main Branch"
  },
  "dob": "1990-01-01"
}
