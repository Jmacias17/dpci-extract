from flask import Flask, request, jsonify
from flask_cors import CORS
from ocr_utils import extract_dpci_from_image

app = Flask(__name__)
CORS(app)

@app.route('/ocr', methods=['POST'])
def ocr_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    dpci_matches = extract_dpci_from_image(image_file.read())
    return jsonify({'dpci': dpci_matches})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
