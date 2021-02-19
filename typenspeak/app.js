// Init speech synth api
const synth = window.speechSynthesis

// Query selectors
const textForm = document.querySelector("form")
const textInput = document.querySelector("#text-input")
const voiceSelect = document.querySelector("#voice-select")
const rate = document.querySelector("#rate")
const rateValue = document.querySelector("#rate-value")
const pitch = document.querySelector("#pitch")
const pitchValue = document.querySelector("#pitch-value")

// Voices array
let voices = []

const getVoices = () => {
    voices = synth.getVoices()

    // Loop through voices and create option tag
    voices.forEach(voice => {
        const option = document.createElement("option")
        option.textContent = `${voice.name} (${voice.lang})`
        
        // Custom attb
        option.setAttribute("data-name", voice.name)    
        option.setAttribute("data-lang", voice.lang)    

        voiceSelect.appendChild(option)
    })
}

getVoices()
if(synth.onvoiceschanged !== undefined){
    synth.onvoiceschanged = getVoices;
}


// Speak
const speak = () => {
    
    // Check if speaking
    if(synth.speaking) {
        console.error("Already Speaking!")
        return
    }

    if(textInput.value == '') return

    // Add waves background
    document.body.style.background = "#141414 url(img/wave.gif) repeat-x 100% 100%"
    
    // Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value)
    speakText.onend = e => {
        console.log("Done speaking")
        document.body.style.background ="#141414"
    }

    speakText.onerror = e => {
        console.error(e)
    }

    // Selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute("data-name")

    // Loop through voices
    voices.forEach(voice => {
        if(voice.name == selectedVoice){
            speakText.voice = voice
        }
    })

    // Set pitch and rate
    speakText.rate = rate.value
    speakText.pitch = pitch.value

    synth.speak(speakText)
}

// Event Listeners
textForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    speak()
    textInput.blur()
})

// Rate and pitch value change
rate.addEventListener("change", e => rateValue.textContent = rate.value)
pitch.addEventListener("change", e => pitchValue.textContent = pitch.value)

// Voice change
voiceSelect.addEventListener("change", e => speak())