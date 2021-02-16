const slider = document.querySelector(".slider-container")
const slides = Array.from(document.querySelectorAll(".slide"))

let isDragging = false
let startPos = 0
let currentTranslate = 0
let prevTranslate = 0
let animationID = 0
let currentIndex = 0


slides.forEach((slide, index) => {
    const slideImage = slide.querySelector("img")
    slideImage.addEventListener("dragstart", (e) => e.preventDefault())

    // Touch events
    slide.addEventListener("touchstart", touchStart(index))
    slide.addEventListener("touchend", touchEnd)
    slide.addEventListener("touchmove", touchMove)

    // Mouse events
    slide.addEventListener("mousedown", touchStart(index))
    slide.addEventListener("mouseup", touchEnd)
    slide.addEventListener("mouseleave", touchEnd)
    slide.addEventListener("mousemove", touchMove)

})


// Disable context menu
window.oncontextmenu = function(event) {
    event.preventDefault()
    event.stopPropagation()
    return false
}

// Touch starts
function touchStart(index) {
    return function(event) {
        currentIndex = index
        startPos = getPositionX(event)
        isDragging = true

        animationID = requestAnimationFrame(animation)
        slider.classList.add("grabbing")
    }
}

// Touch ends
function touchEnd() {
    isDragging = false
    cancelAnimationFrame(animationID)

    const movedBy = currentTranslate - prevTranslate

    if (movedBy < -100 && currentIndex < slides.length - 1) {
        currentIndex += 1
    }

    if (movedBy > 100 && currentIndex > 0) {
        currentIndex -= 1
    }

    setPositionByIndex()
    slider.classList.remove("grabbing")
}

// Touch moves
function touchMove(event) {
    if (!isDragging) return

    const currentPosition = getPositionX(event)
    currentTranslate = prevTranslate + currentPosition - startPos
}

function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
}

function animation() {
    setSliderPosition()
    if (isDragging) requestAnimationFrame(animation)
}

function setSliderPosition() {
    slider.style.transform = `translateX(${currentTranslate}px)`
}

function setPositionByIndex() {
    currentTranslate = currentIndex * -window.innerWidth
    prevTranslate = currentTranslate
    setSliderPosition()
}