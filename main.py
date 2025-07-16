from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

# 1) Root Route Handler
@app.route('/')
def home():
    return "EasyMed is LIVE! Use /teleconsult or /ai-triage"

# Additional routes for the mentioned endpoints
@app.route('/teleconsult')
def teleconsult():
    return "Teleconsult service is available"

@app.route('/ai-triage')
def ai_triage():
    return "AI Triage service is available"

# Serve static files
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

# Route to serve the main HTML page
@app.route('/app')
def app_page():
    return send_from_directory('static', 'index.html')

if __name__ == '__main__':
    # 2) Verify Port Binding - Use Replit's port (usually 8080)
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port, debug=True)