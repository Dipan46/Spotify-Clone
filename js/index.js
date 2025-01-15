// GLOBAL VARIABLES
let currentSong = new Audio(); // Audio object for playing songs
let currFolder; // Current folder being accessed
let songList = []; // List of songs in the current folder
let currentIndex = 0; // Index of the currently playing song

//  Retrieves the list of songs from the specified folder 
async function getSongs(folder) {
    try {
        currFolder = folder;
        console.log(`Fetching songs from folder: ${folder}`);
        let response = await fetch(`http://127.0.0.1:5500/${folder}/`);
        let html = await response.text();

        let div = document.createElement("div");
        div.innerHTML = html;

        // Filter and map songs to an array
        songList = Array.from(div.querySelectorAll("a"))
            .filter(link => link.href.endsWith(".mp3"))
            .map(link => decodeURIComponent(link.href.split(`/${folder}/`)[1]));

        console.log(`Songs found: ${songList}`);

        // Update the UI with the song list
        let songUl = document.querySelector(".songList ul");
        songUl.innerHTML = "";
        songList.forEach(song => {
            songUl.innerHTML += `<li>
                <div class="songinfo">
                    <img src="img/music.svg" alt="img">
                    <div class="songName">
                        <div>${song}</div>
                        <div>Song Artist</div>
                    </div>
                </div>
                <img src="img/play_hallow.svg" class="libplay" alt="play">
            </li>`;
        });

        // Add click event listeners to each song
        document.querySelectorAll(".songList li").forEach((li, index) => {
            li.addEventListener("click", () => {
                currentIndex = index; // Update current index
                playMusic(songList[currentIndex]);
            });
        });
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

//   Display Albums
async function displayAlbums() {
    try {
        console.log("Fetching album list...");
        let response = await fetch(`http://127.0.0.1:5500/song/`);
        let html = await response.text();

        let div = document.createElement("div");
        div.innerHTML = html;

        let anchors = div.querySelectorAll("a");
        let cardContainer = document.querySelector(".cardContainer");

        // Loop through each album and fetch its details
        for (let anchor of anchors) {
            if (anchor.href.includes("/song/")) {
                let albumName = anchor.href.split("/").pop();
                console.log(`Fetching album info for: ${albumName}`);
                let albumResponse = await fetch(`http://127.0.0.1:5500/song/${albumName}/info.json`);
                let albumInfo = await albumResponse.json();

                let coverImage = albumInfo.cover || "img/cover.jpg";

                // Add album card to the UI
                cardContainer.innerHTML += `<div data-folder="${albumName}" class="card">
                    <div class="play">
                        <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="24" cy="24" r="24" fill="#3be477"></circle>
                            <g transform="translate(12, 12)">
                                <path fill="black" d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round"></path>
                            </g>
                        </svg>
                    </div>
                    <img src="${coverImage}" alt="${albumInfo.title}">
                    <h2>${albumInfo.title}</h2>
                    <p>${albumInfo.description}</p>
                </div>`;
            }
        }

        // Add click event listeners to each album card
        document.querySelectorAll(".card").forEach(card => {
            card.addEventListener("click", () => {
                let folder = card.dataset.folder;
                console.log(`Album clicked: ${folder}`);
                getSongs(`song/${folder}`);
            });
        });
    } catch (error) {
        console.error("Error loading albums:", error);
    }
}


// Play Music
const playMusic = (track) => {
    const songPath = `/${currFolder}/` + track;
    console.log(`Playing song: ${songPath}`);
    currentSong.src = songPath;
    currentSong.play();
    pp.src = "/img/pause.svg";
    document.querySelector(".song-info").innerHTML = track.replace(".mp3", "");
};

//  Play Next Song
const playNext = () => {
    if (currentIndex + 1 < songList.length) {
        currentIndex++;
        playMusic(songList[currentIndex]);
    } else {
        console.log("No more songs in the list.");
    }
};

//   Play Previous Song
const playPrevious = () => {
    if (currentIndex - 1 >= 0) {
        currentIndex--;
        playMusic(songList[currentIndex]);
    } else {
        console.log("This is the first song in the list.");
    }
};

async function main() {
    await displayAlbums();

    // Update song time and progress bar
    currentSong.addEventListener("timeupdate", () => {
        const minutes = Math.floor(currentSong.currentTime / 60) || 0;
        const seconds = Math.floor(currentSong.currentTime % 60) || 0;
        const totalMinutes = Math.floor(currentSong.duration / 60) || 0;
        const totalSeconds = Math.floor(currentSong.duration % 60) || 0;

        document.querySelector(".song-time").innerHTML = `${minutes}:${seconds}/${totalMinutes}:${totalSeconds}`;

        const progress = currentSong.duration ? (currentSong.currentTime / currentSong.duration) * 100 : 0;
        document.getElementById('seekbar').value = progress;
    });

    // Seekbar control
    document.getElementById('seekbar').addEventListener("input", (e) => {
        const newTime = (e.target.value / 100) * currentSong.duration;
        currentSong.currentTime = newTime;
    });

    // Play/Pause button
    pp.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            pp.src = "/img/pause.svg";
        } else {
            currentSong.pause();
            pp.src = "/img/play_white.svg";
        }
    });

    // Attach Next and Previous Buttons
    nxt.addEventListener("click", playNext);
    prv.addEventListener("click", playPrevious);

    // Menu toggle for mobile view
    document.querySelector(".hamb").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".clo").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    });
}

main();
