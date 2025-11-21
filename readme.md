# 🎵 MP3 Player

A simple web-based MP3 player built with Flask and JavaScript.

## Features

- Play, pause, stop MP3 files
- Song playlist with click-to-play
- Progress bar with seek
- Volume control
- Previous/Next buttons
- Auto-play next song
- Modern UI design

## Installation

### 1. Install Python dependencies

```bash
pip install -r backend/requirements.txt
```

### 2. Add MP3 files

Place your MP3 files in the `Music/` folder.

## Usage

### Start the server

```bash
python backend/main.py
```

### Open in browser

```
http://localhost:5000
```

### Play music

- Click a song to play it
- Use Play/Pause/Stop buttons
- Click progress bar to seek
- Use volume slider to adjust volume
- Click Previous/Next to navigate

## Project Structure

```
Building a mp3 player/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── Music/
```

## Requirements

- Python 3.7+
- Modern web browser
- MP3 files in Music folder

## Configuration

**Change port** - Edit `backend/main.py` line 48:
```python
app.run(debug=True, host='localhost', port=5000)
```

**Change music folder** - Edit `backend/main.py` line 10:
```python
MUSIC_FOLDER = os.path.join(BASE_DIR, "Music")
```

## Troubleshooting

**Songs not loading:**
- Ensure `Music/` folder exists
- Check backend is running
- Verify MP3 files are in folder

**No audio:**
- Check browser permissions
- Verify MP3 files are valid
- Try different browser

**Port in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

## API Endpoints

- `GET /api/songs` - Get list of songs
- `GET /music/<filename>` - Get MP3 file

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## License

MIT License

## Author

Rakib