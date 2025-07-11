import easyocr
from PIL import Image
import numpy as np
import re
import io
import cv2  # new import for preprocessing

reader = easyocr.Reader(['en'])

# Pattern for valid DPCI structure: XXX-XX-XXXX
dpci_pattern = re.compile(r"\d{3}-\d{2}-\d{4}")

def clean_and_extract_dpci(text):
    # Strip surrounding punctuation and spaces
    text = text.strip("[](){}<>:;., '\"")

    # Replace common OCR misreads and fix delimiters
    text = text.replace('B', '8').replace('O', '0').replace('l', '1').replace('@', '0')

    # Replace dots or colons that should be dashes
    text = text.replace('.', '-').replace(':', '-')

    # Remove spaces inside the text
    text = text.replace(' ', '')

    # Extract DPCI pattern again
    match = dpci_pattern.search(text)
    if match:
        return match.group()
    return None


def preprocess_image(image_np):
    # 1. Resize first to improve small text readability
    resized = cv2.resize(image_np, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)

    # 2. Convert to grayscale
    gray = cv2.cvtColor(resized, cv2.COLOR_RGB2GRAY)

    # 3. Gaussian blur to reduce noise
    blur = cv2.GaussianBlur(gray, (3, 3), 0)

    # 4. Adaptive thresholding without inversion
    thresh = cv2.adaptiveThreshold(
        blur, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11, 2)

    # 5. Skip morphology for now (optional)
    # kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    # morph = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    # 6. Convert to RGB for EasyOCR input
    processed_img = cv2.cvtColor(thresh, cv2.COLOR_GRAY2RGB)

    # 7. Save images for debugging (optional)
    cv2.imwrite("debug_resized.png", cv2.cvtColor(resized, cv2.COLOR_RGB2BGR))
    cv2.imwrite("debug_thresh.png", thresh)

    return processed_img


def extract_dpci_from_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image_np = np.array(image)

    # Preprocess the image before OCR
    processed_img = preprocess_image(image_np)

    results = reader.readtext(processed_img)
    raw_texts = [text for _, text, _ in results]

    print("Raw OCR Results:", raw_texts)

    dpci_matches = []

    for raw in raw_texts:
        cleaned = clean_and_extract_dpci(raw)
        if cleaned:
            dpci_matches.append(cleaned)

    # Remove duplicates
    return list(set(dpci_matches))
