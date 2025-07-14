# ----------------------------------------
# 📦 Flask API for DPCI Extraction & Product Lookup
# ----------------------------------------
from flask import Flask, request, jsonify
from flask_cors import CORS
from ocr_utils import extract_dpci_from_image, get_product_info
# ----------------------------------------
# 🔧 Flask App Configuration
# ----------------------------------------
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# ----------------------------------------
# 🧠 OCR Endpoint — Extract DPCIs from Uploaded Image
# ----------------------------------------
@app.route('/extract-dpcis', methods=['POST'])
def extract_dpcis():
    """
    Accepts a single image file via form-data and returns a list of extracted DPCIs.
    Endpoint: POST /extract-dpcis
    """
    print("📥 Received OCR request")

    if 'image' not in request.files:
        print("❌ No image uploaded")
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    print("🧠 Running OCR on image...")

    dpci_matches = extract_dpci_from_image(image_file.read())
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
    app.run(host='0.0.0.0', port=5000, debug=True)
