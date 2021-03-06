const musicContainer = document.querySelector(".music-container")

const prevBtn = document.querySelector("#prev")
const playBtn = document.querySelector("#play")
const nextBtn = document.querySelector("#next")

const volumeBtn = document.querySelector("#volume")
let isMuted = false;
let currentVolume = 1

const audio = document.querySelector("#audio")
const progressContainer = document.querySelector(".progress-container")
const progress = document.querySelector(".progress")
const title = document.querySelector("#title")
const cover = document.querySelector("#cover")

// Song titles
const songs = ["hey", "summer", "ukulele"]

// Keep track of the songs
let songIndex = 1;

// Initially load song into DOM
loadSong(songs[songIndex])

// Update the song details
function loadSong(song){
    title.innerText = song
    audio.src = `music/${song}.mp3`
    cover.src = `images/${song}.jpg`
}

function playSong(){
    musicContainer.classList.add("play")
    playBtn.querySelector("i.fas").classList.remove("fa-play")
    playBtn.querySelector("i.fas").classList.add("fa-pause")
    audio.play()
}

function pauseSong(){
    musicContainer.classList.remove("play")
    playBtn.querySelector("i.fas").classList.add("fa-play")
    playBtn.querySelector("i.fas").classList.remove("fa-pause")
    audio.pause()
}

function updateProgress(e){
    const {duration, currentTime} = e.srcElement
    const progressPercent = (currentTime / duration) * 100
    progress.style.width=`${progressPercent}%`
}

function setProgress(e){
    const width = this.clientWidth
    const clickX = e.offsetX
    const duration = audio.duration
    audio.currentTime = (clickX / width ) * duration 
}

function nextSong(){
    if(songIndex == songs.length-1){
        songIndex = 0
    } else {
        songIndex++
    }

    loadSong(songs[songIndex])
    playSong()
}

// Event Listeners
prevBtn.addEventListener('click',()=>{
    if(songIndex == 0){
        songIndex = songs.length-1;
    } else {
        songIndex--
    }

    loadSong(songs[songIndex])
    playSong()

})

playBtn.addEventListener('click',()=>{
    const isPlaying = musicContainer.classList.contains("play")

    if(isPlaying) {
        pauseSong()
    } else {
        playSong()
    }
})

nextBtn.addEventListener('click', nextSong)

audio.addEventListener("timeupdate", updateProgress)

progressContainer.addEventListener("click", setProgress)

audio.addEventListener("ended", nextSong)

volumeBtn.addEventListener("click", function(){
    isMuted = !isMuted

    if(isMuted){
        volumeBtn.querySelector("i.fas").classList.add("fa-volume-mute")
        volumeBtn.querySelector("i.fas").classList.remove("fa-volume-up")
        audio.volume = 0

    } else {
        volumeBtn.querySelector("i.fas").classList.remove("fa-volume-mute")
        volumeBtn.querySelector("i.fas").classList.add("fa-volume-up")
        audio.volume = 1

    }
})

window.addEventListener("wheel", (e)=>{
    const currentScroll = e.deltaY
    
    if(currentScroll > 0){
        currentVolume= currentVolume - 0.025;
    } else {
        currentVolume= currentVolume + 0.025;
    }

    currentVolume = currentVolume > 1 ? 1 : currentVolume
    currentVolume = currentVolume < 0 ? 0 : currentVolume
    audio.volume = currentVolume

})