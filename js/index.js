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

        // links.forEach(link => {
        //     if (link.href.endsWith(".mp3")) {
        //         songs.push(link.href);
        //     }
        // });

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

let currentSong = new Audio(); //creating global audio onject
const playMusic = (track) => {
    // Selectiong specific song
    currentSong.src = "/songs/" + track;
    currentSong.play();
    pp.src = "/img/pause.svg";
    document.querySelector(".song-info").innerHTML = track.replace(".mp3", "");
}


async function main() {
    let songs = await grtSongs();
    console.log(songs);

    // Show All songs in your libreary
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
                                <div class="songinfo">
                                <img src="img/music.svg" alt="img" srcset="">
                                <div class = "songName">
                                    <div>
                                        ${song.replaceAll("%20", " ")}
                                    </div>
                                <div>
                                    Song Artist
                                </div>
                                </div>
                            </div>
                            <img src="img/play_hallow.svg" class="libplay"  alt="play" srcset="">
                        </li>`;
    }

    // Attach event listner to song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', () => {
            playMusic(e.querySelector(".songName").firstElementChild.innerHTML.trim());
        });
    })

    // Attach event listner to previous play and next button
    pp.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            pp.src = "/img/pause.svg";
        } else {
            currentSong.pause();
            pp.src = "/img/play_white.svg";
        }
    });

    //Time update event
    currentSong.addEventListener("timeupdate", () => {
        const minutes = Math.floor(currentSong.currentTime / 60);
        const seconds = Math.floor(currentSong.currentTime % 60);
        const formattedCurrentTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        const totalMinutes = Math.floor(currentSong.duration / 60);
        const totalSeconds = Math.floor(currentSong.duration % 60);
        const formattedDuration = `${totalMinutes < 10 ? '0' : ''}${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;



        document.querySelector(".song-time").innerHTML = formattedCurrentTime + "/" + formattedDuration;
    });

    document.getElementById('seekbar').addEventListener('input', (e) => {
        const seekbar = e.target;
        const newTime = (seekbar.value / 100) * currentSong.duration;
        currentSong.currentTime = newTime;
    });
}

main();