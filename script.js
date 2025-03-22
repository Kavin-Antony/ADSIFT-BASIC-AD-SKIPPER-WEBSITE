// const streams = [
//   { "url": "https://centova.aarenworld.com/proxy/894tamilfm/stream", "name": "Tamil FM 89.4", "id": 1 },
//   { "url": "https://playerservices.streamtheworld.com/api/livestream-redirect/MINNAL_FMAAC.aac", "name": "Minnal FM 92.3", "id": 2 },
//   { "url": "https://www.liveradio.es/http://radio.lotustechnologieslk.net:8006/;stream.mp3", "name": "Suriyan FM 103.4", "id": 3 },
//   { "url": "https://jayamfm-prabak78.radioca.st/stream", "name": "Jayam FM 7.1", "id": 4},
//   { "url": "https://playerservices.streamtheworld.com/api/livestream-redirect/OLI968FMAAC.aac?dist=liveonlineradio", "name": "Olisg FM 96.8 FM", "id": 5}
// ];

const streams = [
  { "url": "https://listen.openstream.co/4428/audio", "name": "Hello FM 106.4", "id": 1 },
  { "url": "https://radios.crabdance.com:8002/5", "name": "Radio City 91.1", "id": 2 },
  { "url": "https://radios.crabdance.com:8002/1", "name": "Radio Mirchi 98.3", "id": 3 },
  { "url": "https://radios.crabdance.com:8002/2", "name": "Suriyan FM 93.5", "id": 4},
  { "url": "https://radios.crabdance.com:8002/4", "name": "Big FM 92.7", "id": 5}
];

let currentStreamIndex = 0;
const audioPlayer = document.getElementById("audio-player");
const audioSource = document.getElementById("audio-source");
const stationNameElement = document.getElementById("station-name");
const playButton = document.getElementById("play-button");

document.getElementById("prev-button").addEventListener("click", previousSong);
playButton.addEventListener("click", toggleMute);
document.getElementById("next-button").addEventListener("click", nextSong);

function toggleMute() {
  // If audio is currently unmuted (playing), mute it and change the label to "Play"
  if (!audioPlayer.muted) {
    audioPlayer.muted = true;
    playButton.innerText = "Unmute";
  } else {
    // If audio is muted, unmute it and change the label to "Pause"
    audioPlayer.muted = false;
    playButton.innerText = "Mute";
  }
}

function nextSong() {
  currentStreamIndex = (currentStreamIndex + 1) % streams.length;
  loadStream();
}

function previousSong() {
  currentStreamIndex = (currentStreamIndex - 1 + streams.length) % streams.length;
  loadStream();
}

function loadStream() {
  // When switching streams, ensure audio is unmuted and the button reflects that state.
  audioPlayer.muted = false;
  playButton.innerText = "Mute";

  audioSource.src = streams[currentStreamIndex].url;
  stationNameElement.innerText = streams[currentStreamIndex].name;
  audioPlayer.load();
  audioPlayer.play();
}

async function fetchFMStations() {
  try {
    const response = await fetch('https://goshawk-musical-liger.ngrok-free.app/fm', {
      headers: { "ngrok-skip-browser-warning": "true" } // Bypass Ngrok browser warning
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (!data.fm_id || !Array.isArray(data.fm_id)) {
      console.error("Invalid data format:", data);
      return;
    }

    const allowedFMIds = new Set(data.fm_id);
    const currentFMId = streams[currentStreamIndex].id;

    if (!allowedFMIds.has(currentFMId)) {
      const firstAllowedIndex = streams.findIndex(stream => allowedFMIds.has(stream.id));
      if (firstAllowedIndex !== -1) {
        console.log(`Switching to allowed stream: ${streams[firstAllowedIndex].name}`);
        currentStreamIndex = firstAllowedIndex;
        loadStream();
      }
    }
  } catch (error) {
    console.error("Error fetching FM stations:", error);
  }
}

// Call the function initially and then every 5 seconds
fetchFMStations();
setInterval(fetchFMStations, 1000);

// Load the initial stream
loadStream();
