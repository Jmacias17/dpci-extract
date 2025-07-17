# ----------------------------------------
# 📦 Flask API for DPCI Extraction & Product Lookup
# ----------------------------------------
import os
import multiprocessing
from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
import numpy as np
from ocr_utils import extract_dpci_from_image, get_product_info
from concurrent.futures import ThreadPoolExecutor


# ----------------------------------------
# 🔧 Flask App Configuration
# ----------------------------------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for cross-origin requests

# ✅ Preload EasyOCR model once when app starts
print("⏳ Initializing EasyOCR reader...")
reader = easyocr.Reader(['en'], gpu=False)  # use False because Cloud Run has no GPU
reader.readtext(np.zeros((10,10,3), dtype=np.uint8))  # warmup call
print("✅ EasyOCR model ready.")

@app.route('/extract-multiple', methods=['POST'])
def extract_multiple():
    """
    Accepts multiple images (form-data: images[]) and returns a list of DPCI lists,
    one for each image. Processes images concurrently for speed.
    Endpoint: POST /extract-multiple
    """
    print("📥 Received multiple images for OCR")

    image_files = request.files.getlist('images')
    if not image_files:
        print("❌ No images uploaded")
        return jsonify({'error': 'No images provided'}), 400

    # ✅ Process each image concurrently
    def process_single(file_storage):
        try:
            return extract_dpci_from_image(file_storage.read(), reader)
        except Exception as e:
            print(f"❌ OCR failed for one image: {e}")
            return []
    
    # Adjust workers depending on your CPU count
    max_workers = max(1, multiprocessing.cpu_count())
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(process_single, f) for f in image_files]
        results = [future.result() for future in futures]

    # `results` will be a list of dpci lists
    print("✅ Finished processing all images")
    return jsonify({'dpci_lists': results})

# ----------------------------------------
# 🧠 OCR Endpoint — Extract DPCIs from Uploaded Image
# ----------------------------------------
@app.route('/extract-dpcis', methods=['POST'])
def extract_dpcis():
    """
    Accepts a single image file via form-data and returns a list of extracted DPCIs.
    Endpoint: POST /extract-dpcis
    """
    print("📥 Received Single OCR request")

    if 'image' not in request.files:
        print("❌ No image uploaded")
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    print("🧠 Running OCR on image...")

    dpci_matches = extract_dpci_from_image(image_file.read(), reader)
    print("✅ DPCIs Found:", dpci_matches)

    return jsonify({'dpci_list': sorted(dpci_matches)})

# ----------------------------------------
# 🔎 Lookup Endpoint — Get Product Info for Provided DPCIs
# ----------------------------------------

@app.route('/lookup-products', methods=['POST'])
def lookup_products():
    """
    Accepts a JSON list of DPCIs and returns product info for each.
    Endpoint: POST /lookup-products
    """
    print("📥 Received DPCI list for lookup")
    data = request.get_json()

    if not data or 'dpci_list' not in data:
        print("❌ Missing 'dpci_list' in request")
        return jsonify({'error': 'Missing dpci_list'}), 400

    dpci_list = data['dpci_list']
    results = []

    for dpci in dpci_list:
        print(f"🔍 Looking up product for DPCI: {dpci}")
        product_info = get_product_info(dpci)
        print(f"📦 Product Info: {product_info}")
        results.append(product_info)

    return jsonify({'results': results})

# ----------------------------------------
# 🧠 All-In-One Endpoint — Extract and Lookup from Image
# ----------------------------------------

@app.route('/ocr', methods=['POST'])
def ocr_image():
    """
    Accepts a single image, extracts DPCIs, and returns product info for each DPCI.
    Combines the functionality of /extract-dpcis and /lookup-products.
    Endpoint: POST /ocr
    """
    print("📥 Received OCR request")

    if 'image' not in request.files:
        print("❌ No image uploaded")
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    print("🧠 Running OCR on image...")

    dpci_matches = extract_dpci_from_image(image_file.read())
    print("✅ DPCIs Found:", dpci_matches)

    results = []
    for dpci in dpci_matches:
        print(f"🔍 Looking up product for DPCI: {dpci}")
        product_info = get_product_info(dpci)
        print(f"📦 Product Info: {product_info}")
        results.append(product_info)

    print("✅ Done. Returning results.")
    return jsonify({'results': results})

# ----------------------------------------
# 🚀 Run Flask App
# ----------------------------------------

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)