# ----------------------------------------
# 🧠 Core Python Libraries
# ----------------------------------------
import base64
import io
import random
import re
import time

# ----------------------------------------
# 🖼️ Image Processing & OCR
# ----------------------------------------
import cv2
import numpy as np
from PIL import Image
# ----------------------------------------
# 🧾 Barcode Generation
# ----------------------------------------
import barcode
from barcode.writer import ImageWriter

# ----------------------------------------
# 🌐 Web Scraping
# ----------------------------------------
from bs4 import BeautifulSoup

# ----------------------------------------
# 🧭 Selenium WebDriver
# ----------------------------------------
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

# ---------------------------------------------
# Regex Pattern: DPCI Format XXX-XX-XXXX
# ---------------------------------------------
dpci_pattern = re.compile(r"\d{3}-\d{2}-\d{4}")

# ---------------------------------------------
# Image Preprocessing: Resize, Grayscale, Threshold
# ---------------------------------------------
def preprocess_image(image_np):
    """
    Enhances image clarity for better OCR accuracy:
    - Conditionally resizes if input is small
    - Converts to grayscale
    - Applies Gaussian blur and adaptive threshold
    - Converts back to RGB for EasyOCR
    """

    # Conditionally upscale image if it's small
    if image_np.shape[0] < 1000:
        resized = cv2.resize(image_np, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)
    else:
        resized = image_np

    # Convert to grayscale
    gray = cv2.cvtColor(resized, cv2.COLOR_RGB2GRAY)

    # Apply Gaussian blur to reduce noise
    blur = cv2.GaussianBlur(gray, (3, 3), 0)

    # Adaptive thresholding (binarization)
    thresh = cv2.adaptiveThreshold(
        blur, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11, 2
    )

    # Convert back to RGB for EasyOCR input
    processed_img = cv2.cvtColor(thresh, cv2.COLOR_GRAY2RGB)

    return processed_img

# ---------------------------------------------
# Clean and Extract DPCI Pattern from Text
# ---------------------------------------------
def clean_and_extract_dpci(text):
    """
    Cleans up OCR text and extracts a valid DPCI string if found.
    """
    # Strip common punctuation/symbols
    text = text.strip("[](){}<>:;., '\"")

    # Normalize common delimiters
    text = text.replace('.', '-').replace(':', '-')

    # Remove internal spaces
    text = text.replace(' ', '')

    # Attempt regex match
    match = dpci_pattern.search(text)
    if match:
        return match.group()

    return None

# ---------------------------------------------
# Main DPCI Extraction Function
# ---------------------------------------------
def extract_dpci_from_image(image_bytes, reader):
    """
    Main entry: Converts image bytes into DPCI list using EasyOCR.
    Steps:
    - Loads image
    - Applies preprocessing
    - Extracts text using OCR
    - Cleans and matches DPCI patterns
    """

    # Load image from byte stream and convert to RGB
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Resize aggressively if still large
    if image.width > 1700 or image.height > 1700:
        image.thumbnail((1700, 1700), Image.Resampling.LANCZOS)

    # Now convert to NumPy aray
    image_np = np.array(image)

    # Preprocess image for better OCR results
    processed_img = preprocess_image(image_np)

    # Run OCR (detail=0 returns only text strings, faster)
    raw_texts = reader.readtext(processed_img, detail=0, width_ths=0.6)

    print("Raw OCR Results:", raw_texts)  # Optional: Debug log

    dpci_matches = []

    # Clean and extract DPCI patterns from raw OCR text
    for raw in raw_texts:
        cleaned = clean_and_extract_dpci(raw)
        if cleaned:
            dpci_matches.append(cleaned)

    # Remove duplicates and return
    return list(set(dpci_matches))

# ---------------------------------------
# Get Product Info from DPCI
# ---------------------------------------
def human_delay(min_sec=1.5, max_sec=3.5):
    time.sleep(random.uniform(min_sec, max_sec))

def get_product_info(dpci):
    options = Options()
    options.headless = False  # Run visible session to reduce detection
    options.add_argument("--start-minimized")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)

    # Random user-agent
    user_agent = random.choice([
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    ])
    options.add_argument(f"user-agent={user_agent}")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    # Stealth: Hide navigator.webdriver
    driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        "source": """
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined
        });
        """
    })

    product_data = {
        'dpci': dpci,
        'title': None,
        'price': None,
        'tcin': None,
        'upc': None,
        'product_url': None,
        'barcode_base64_png': None
    }

    try:
        search_url = f"https://www.target.com/s?searchTerm={dpci}"
        driver.get(search_url)
        human_delay()

        # Scroll to trigger lazy loading
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        human_delay()

        container = driver.find_element(By.CSS_SELECTOR, 'div[data-module-type="ListingPageProductListCards"]')
        anchors = container.find_elements(By.TAG_NAME, 'a')

        product_url = None
        for a in anchors:
            href = a.get_attribute('href')
            if href and '/p/' in href:
                product_url = "https://www.target.com" + href if href.startswith('/') else href
                break

        if not product_url:
            print(f"[WARN] No product found for DPCI: {dpci}")
            return product_data

        product_data['product_url'] = product_url

        driver.get(product_url)
        human_delay()

        # Expand Specs via JS
        try:
            driver.execute_script("""
                const specButton = [...document.querySelectorAll('button')]
                    .find(btn => btn.textContent.includes('Specifications'));
                if (specButton && specButton.getAttribute('aria-expanded') === 'false') {
                    specButton.setAttribute('aria-expanded', 'true');
                    specButton.click();
                }
            """)
            human_delay(1, 2)
        except Exception as e:
            print(f"[WARN] Could not expand Specifications: {e}")

        soup = BeautifulSoup(driver.page_source, 'html.parser')

        try:
            title_elem = driver.find_element(By.CSS_SELECTOR, 'h1[data-test="product-title"]')
            product_data['title'] = title_elem.text
        except:
            pass

        try:
            price_elem = driver.find_element(By.CSS_SELECTOR, '[data-test="product-price"]')
            product_data['price'] = price_elem.text
        except:
            pass

        try:
            spec_section = soup.find('div', {'data-test': 'item-details-specifications'})
            if spec_section:
                spec_items = spec_section.find_all('div')
                for item in spec_items:
                    label = item.find('b')
                    if not label:
                        continue
                    key = label.text.strip()
                    value = label.next_sibling
                    if key == "TCIN" and value:
                        product_data['tcin'] = value.strip()
                    elif key == "UPC" and value:
                        product_data['upc'] = value.strip()
        except Exception as e:
            print(f"[WARN] Spec parsing failed: {e}")

        try:
            barcode_value = product_data['tcin'] or product_data['upc']
            if barcode_value:
                CODE128 = barcode.get_barcode_class('code128')
                code128 = CODE128(barcode_value, writer=ImageWriter())
                fp = io.BytesIO()
                code128.write(fp)
                fp.seek(0)
                product_data['barcode_base64_png'] = base64.b64encode(fp.read()).decode('utf-8')
        except Exception as e:
            print(f"[ERROR] Barcode generation failed: {e}")

    except Exception as e:
        print(f"[ERROR] Failed to scrape for {dpci}: {e}")
    finally:
        driver.quit()

    return product_data
