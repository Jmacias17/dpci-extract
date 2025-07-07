# 📸 DPCI Extractor — Image Scanner (Web App)

**DPCI Extractor** is a web-based tool designed to scan images (from upload or camera), extract **DPCI numbers [###-##-####]** using OCR, organize them by page, and export the results into a downloadable Excel file — complete with **product title**, **DPCI IDs**, and **auto-generated barcodes**.

---

## Table of Contents

- [Live App](#live-app)
- [Current Features](#current-features)
- [Tech Stack](#tech-stack)
- [Roadmap](#roadmap)
- [Developer Notes](#developer-notes)
- [License](#license)
- [Changelog Summary](#changelog-summary)


---

## Live App

👉 [Currently Not For Public Use]  
_No downloads, no logins, and no data storage — everything happens in your browser._

<a class="top-link hide" href="#table-of-contents">↑ [Back to Table of Contents] ↑</a>

---

### Current Features:
- **Image Upload** – Add images via file picker or drag-and-drop
- **Preview Layout** – View uploaded images as paginated cards using Bootstrap
- **Image Deletion** – Remove individual images before processing
- **Responsive Design** – Works across desktop and mobile browsers
- **Clean UI** – Red-themed minimal interface, inspired by Target branding

<a class="top-link hide" href="#table-of-contents">↑ [Back to Table of Contents] ↑</a>

---

## Tech Stack

- **Framework**: React (via Vite)
- **Styling**: React-Bootstrap
- **OCR (Coming Soon)**: Tesseract.js (client-side)
- **Excel Export (Planned)**: SheetJS (xlsx), jsBarcode (barcodes)
- **Hosting**: Firebase Hosting

> 💡 Note: This app is 100% frontend-only. No database, no API, no backend. Fast and private — your data never leaves your browser.

<a class="top-link hide" href="#table-of-contents">↑ [Back to Table of Contents] ↑</a>

---

## Roadmap

### Coming Next:
- [ ] OCR support for reading DPCI numbers from uploaded images
- [ ] Barcode image generation for each DPCI
- [ ] Excel export with one sheet per ad page

<a class="top-link hide" href="#table-of-contents">↑ [Back to Table of Contents] ↑</a>

---

## Developer Notes

This app follows solid software engineering principles:
- Low coupling & high cohesion
- Fully modular React components
- Optimized for one-screen interaction
- Clean separation of logic and presentation

You can extend this project by plugging in OCR, export logic, or minimal backend if needed later.

<a class="top-link hide" href="#table-of-contents">↑ [Back to Table of Contents] ↑</a>

---

## License

MIT License © 2025 Jesus Macias

<a class="top-link hide" href="#table-of-contents">↑ [Back to Table of Contents] ↑</a>

---

## Changelog Summary 

### Version 0.1.5 - File Upload Bug Fixes
Changelog:
* Fixed an issue that when adding more files/images after initial upload, the previous files/images would be deleted.
* Added protection to not allow duplicates of images
* Files/Images that are deleted can be re-uploaded


### Version 0.1.4 - ReadMe Table of Contents Fixed
Changelog:
* Fixed Table of Contents Links not taking to section specified


### Version 0.1.3 - ReadMe File
Changelog:
* Reset and restructured all project documentation



### Version 0.1.2 – Documentation Reset
Changelog:
* Reset and restructured all project documentation
* Created README.md with clear sections and GitHub-compatible table of contents
* Integrated scroll-to-top anchor links for better navigation
* Clarified tech stack breakdown and roadmap priorities
* Refined developer notes to highlight frontend-only architecture
* Updated license and changelog summary sections
* No functional changes to UI or logic — focus was on code clarity and documentation polish
Staged for continued development (OCR + Excel export pipeline next)


### Version 0.1.1 - Image Uploader Complete
Changelog:
* Completed modular ImageUploader component with drag-and-drop grid
* Added image preview cards with deletion and ordering support
* Added ability to remove all Images at once.
* Mobile and Camera Roll Support Enabled
* Implemented custom hook (useImageHandler) for image state & cleanup
* Applied responsive layout and styling
* Ensured memory cleanup for all Object URLs on file load/remove
* Confirmed best practices: low coupling, high cohesion, modular structure
* Ready for base deployment to Firebase Hosting, tested on live server
* Comment and doc statements


### Version 0.0.1 - Initial Setup
Changelog:
* Added Folders and Layout Following Best Practices for Low Coupling and High Cohesion
* Added ReadMe Template - Will be updating in future versions
* Version Control will be integrated with a.b.c
-a: Major Release [Huge Updates, Expansions]
-b: Minor Release [Priority Bug Fixes, Small Updates]
-c: Minimal Fixes [Clean-Ups, Logic Enhancement, Quick Tweaks]




<a class="top-link hide" href="#table-of-contents">↑ [Back to Table of Contents] ↑</a>
