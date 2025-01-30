# Spotify Clone

This project is a simple Spotify-like music player built with HTML, CSS, and JavaScript. It fetches and plays songs dynamically from a specified folder and displays playlists and albums.

## Features

- **Dynamic Song Fetching:** dynamically Retrieves song files from a specified folder.
- **Album Display:** Fetches and displays available albums from the `song/` directory.
- **Music Player:** Play, pause, next, and previous song controls.
- **Progress Bar:** Displays the current progress of the song being played.
- **Responsive Design:** Adapts to different screen sizes.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API

## Project Structure

```
|-- index.html
|-- js/
|   |-- index.js
|-- css/
|   |-- style.css
|   |-- responsive.css
|-- img/
|   |-- (various icons and images)
|-- song/
|   |-- (MP3 files and album folders)
```

## Setup and Usage

1. Clone the repository:
   ```sh
   git clone https://github.com/Dipan46/Spotify-Clone.git
   ```
2. Navigate to the project folder:
   ```sh
   cd spotify-clone
   ```
3. Start a local server (Python example):
   ```sh
   python -m http.server 5500
   ```
4. Open `http://xxx.0.0.1:5500/index.html` in your browser.

## How It Works

- **Fetching Songs:**
  - `getSongs(folder)`: Fetches MP3 files from the specified folder.
  - Displays the songs in the playlist UI.
- **Displaying Albums:**
  - `displayAlbums()`: Fetches album details from `song/` folder.
  - Renders album cards with titles, descriptions, and cover images.
- **Music Controls:**
  - `playMusic(track)`: Plays the selected song.
  - `playNext()`: Plays the next song in the list.
  - `playPrevious()`: Plays the previous song.
  - Event listeners update the UI (play/pause, seek bar, etc.).

## Notes

- Ensure your `song/` folder contains MP3 files.
- The project assumes a JSON file (`info.json`) inside album folders for album details.
- Designed to run locally or on a simple static hosting environment.

## Contributing

Feel free to fork the repository and submit pull requests for improvements.

**Preview** - https://dipan46.github.io/Spotify-Clone/
