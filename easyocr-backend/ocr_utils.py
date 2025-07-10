import easyocr
from PIL import Image
import numpy as np
import re
import io

reader = easyocr.Reader(['en'])

# Strict DPCI format: must be exactly ###-##-####
dpci_pattern = re.compile(r"^\d{3}-\d{2}-\d{4}$")

def extract_dpci_from_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image_np = np.array(image)

    results = reader.readtext(image_np)
    all_text = [text for _, text, _ in results]

    # Only return exact matches like 123-45-6789
    dpci_matches = [text for text in all_text if dpci_pattern.match(text)]
    return dpci_matches
