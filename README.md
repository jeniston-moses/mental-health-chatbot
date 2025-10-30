
AI Support Bot - Frontend Only
=============================

This is a pure HTML/CSS/JS front-end that calls Google Gemini (gemini-1.5-flash) directly from the browser.
Files:
- index.html
- style.css
- script.js

IMPORTANT SECURITY NOTE:
- Placing your Gemini API key inside client-side JS exposes it publicly. For production, proxy requests through a secure backend.
- The code uses the browser's SpeechRecognition (if available) for mic input and SpeechSynthesis for voice output.

To use:
1. Replace GEMINI_API_KEY placeholder in script.js with your actual key.
2. Open index.html in a browser (Chrome recommended) or deploy to Azure Static Web Apps / any static host.
