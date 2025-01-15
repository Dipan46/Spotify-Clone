async function grtSongs() {
    try {
        // Fetch the directory listing
        let response = await fetch("http://127.0.0.1:5500/songs/");
        let html = await response.text();

        // Create a virtual DOM element to parse the response
        let div = document.createElement("div");
        div.innerHTML = html;

        // Extract <a> tags from the fetched content
        let links = div.querySelectorAll("a");
        let songs = [];

        links.forEach(link => {
            if (link.href.endsWith(".mp3")) {
                songs.push(link.href.split("/songs/")[1]);
            }
        });

        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

let currentSong = new Audio(); // Creating a global audio object
const playMusic = (track) => {
    // Decoding the track name to replace "%20" with spaces
    const decodedTrack = decodeURIComponent(track);

    // Selecting specific song
    currentSong.src = "/songs/" + track;
    currentSong.play();
    pp.src = "/img/pause.svg";

    // Updating the song information display
    document.querySelector(".song-info").innerHTML = decodedTrack.replace(".mp3", "");
};

let songs;
async function main() {
    songs = await grtSongs();
    console.log(songs);

    // Show all songs in your library
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
                                <div class="songinfo">
                                <img src="img/music.svg" alt="img" srcset="">
                                <div class = "songName">
                                    <div>
                                        ${decodeURIComponent(song.replaceAll("%20", " "))}
                                    </div>
                                <div>
                                    Song Artist
                                </div>
                                </div>
                            </div>
                            <img src="img/play_hallow.svg" class="libplay"  alt="play" srcset="">
                        </li>`;
    }

    // Attach event listener to songs
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', () => {
            playMusic(e.querySelector(".songName").firstElementChild.innerHTML.trim());
        });
    });

    // Attach event listener to play/pause button
    pp.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            pp.src = "/img/pause.svg";
        } else {
            currentSong.pause();
            pp.src = "/img/play_white.svg";
        }
    });

    // Time update event
    currentSong.addEventListener("timeupdate", () => {
        // Handle current time and duration
        const minutes = Math.floor(currentSong.currentTime / 60) || 0;
        const seconds = Math.floor(currentSong.currentTime % 60) || 0;
        const formattedCurrentTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        const totalMinutes = Math.floor(currentSong.duration / 60) || 0;
        const totalSeconds = Math.floor(currentSong.duration % 60) || 0;
        const formattedDuration = `${totalMinutes < 10 ? '0' : ''}${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;

        // Update the song time display
        document.querySelector(".song-time").innerHTML = `${formattedCurrentTime}/${formattedDuration}`;

        // Update the seekbar only if duration is valid
        const seekbar = document.getElementById('seekbar');
        const progress = currentSong.duration ? (currentSong.currentTime / currentSong.duration) * 100 : 0;
        seekbar.value = progress; // Update the slider position
    });

    // Reset time display on song change
    const resetTimeDisplay = () => {
        document.querySelector(".song-time").innerHTML = "00:00/00:00";
        document.getElementById('seekbar').value = 0;
    };

    // Updated playMusic function to reset time display before playing
    const playMusic = (track) => {
        const decodedTrack = decodeURIComponent(track);
        currentSong.src = "/songs/" + track;
        resetTimeDisplay(); // Reset time before loading the new song
        currentSong.play();
        pp.src = "/img/pause.svg";
        document.querySelector(".song-info").innerHTML = decodedTrack.replace(".mp3", "");
    };


    document.getElementById('seekbar').addEventListener('input', (e) => {
        const seekbar = e.target;
        const newTime = (seekbar.value / 100) * currentSong.duration; // Calculate new time based on slider value
        currentSong.currentTime = newTime; // Update audio's current time
    });

    // Add previous listener
    prv.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    // Add next listener
    nxt.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    });


    // Add Hamburger listener
    document.querySelector(".hamb").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    // Add Close listener
    document.querySelector(".clo").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    });
}

main();
