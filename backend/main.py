import os
import json
from flask import Flask, jsonify, send_file, send_from_directory
from flask_cors import CORS

os.environ["PYGAME_HIDE_SUPPORT_PROMPT"] = "hide"

# Get the absolute path to parent directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MUSIC_FOLDER = os.path.join(BASE_DIR, "Music")
FRONTEND_FOLDER = os.path.join(BASE_DIR, "frontend")

app = Flask(__name__, static_folder=FRONTEND_FOLDER, static_url_path='')
CORS(app)

@app.route('/')
def index():
    """Serve the main HTML file"""
    return send_from_directory(FRONTEND_FOLDER, 'index.html')

@app.route('/api/songs')
def get_songs():
    """Get list of MP3 files from Music folder"""
    if not os.path.isdir(MUSIC_FOLDER):
        return jsonify({'error': f"Folder 'Music' does not exist"}), 404
    
    try:
        mp3_files = sorted([f for f in os.listdir(MUSIC_FOLDER) if f.endswith('.mp3')])
        songs = [{'id': i, 'name': song} for i, song in enumerate(mp3_files)]
        return jsonify(songs)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/music/<filename>')
def serve_song(filename):
    """Serve MP3 file"""
    try:
        return send_from_directory(MUSIC_FOLDER, filename)
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@app.route('/<path:path>')
def send_static(path):
    """Serve static files (CSS, JS, etc.)"""
    return send_from_directory(FRONTEND_FOLDER, path)

if __name__ == '__main__':
    print(f"Music folder: {MUSIC_FOLDER}")
    print(f"Frontend folder: {FRONTEND_FOLDER}")
    print("Starting MP3 Player server at http://localhost:5000")
    app.run(debug=True, host='localhost', port=5000)