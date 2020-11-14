const app = () =>{
	const song = document.querySelector(".song")
	const play = document.querySelector(".play")
	const outline = document.querySelector(".moving-outline circle")
	const video = document.querySelector(".vid-container video")

	// sounds
	const sounds = document.querySelectorAll(".sound-picker button")

	// Time display
	const display = document.querySelector(".time-display")
	const timeSelect = document.querySelectorAll("[data-time]")


	//get the length of the outline
	const outlineLength = outline.getTotalLength()

	// Duration
	let fakeDuration = 120

	outline.style.strokeDasharray = outlineLength
	outline.style.strokeDashoffset = outlineLength

	// Pick different sounds
	sounds.forEach(sound => {
		sound.addEventListener("click", function(){
			song.src = this.dataset.sound
			video.src = this.dataset.video
			checkPlaying(song, true)
		})
	})
	//Play sound
	play.addEventListener("click", ()=>checkPlaying(song))

	// Select sound
	timeSelect.forEach(time=> {
		time.addEventListener("click", function(){
			reset()
			fakeDuration = this.dataset.time
			let seconds = Math.floor(fakeDuration % 60)
			display.textContent= `${Math.floor(fakeDuration / 60)}:${seconds < 10 && '0'}${seconds}`
		})
	})
	// Duration buttons

	const checkPlaying = (song, pause = false) =>{
		if(fakeDuration == 0) return
		if(song.paused && !pause){
			song.play()
			video.play()
			play.src="./svg/pause.svg"
		}else{
			song.pause()
			video.pause()
			play.src="./svg/play.svg"
		}
	}

	// AWe can animated the circle
	song.ontimeupdate = () =>{
		let currentTime = song.currentTime
		let elapsed = fakeDuration - currentTime
		let seconds = Math.floor(elapsed % 60)
		let minutes = Math.floor(elapsed / 60)

		// Animate the circle
		let progress = outlineLength - (currentTime / fakeDuration) * outlineLength
		outline.style.strokeDashoffset = progress

		// Animated the text
		display.textContent = `${minutes}:${seconds < 10 ? '0'+seconds : seconds}`

		currentTime >= fakeDuration && reset()
	}

	const reset = () => {
		song.pause()
		song.currentTime = 0
		play.src = "./svg/play.svg"
		video.pause()
	}

	
}

app()

