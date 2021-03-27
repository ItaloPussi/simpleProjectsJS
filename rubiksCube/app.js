let movingCubeStartX
let movingCubeStartY
let isMovingCube = false

let xDeg = 0
let yDeg = 0
let previousYDeg = 0
let previousXDeg = 0

const getAngle = x => {
    return 0 - 90 * x;
}

const getWidth = () => {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    )
}

const getHeight = () => {
return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
)
}


const handleMouseDown = e => {
    if(e.target.classList.contains("container")){
        isMovingCube = true
        movingCubeStartX = e.pageX
        movingCubeStartY = e.pageY
    }
}

const handleMouseMove = e => {
    if(isMovingCube){
        const mouseX = e.pageX
        const moveToY = (mouseX - movingCubeStartX) / 600
        yDeg = getAngle(moveToY) + previousYDeg;

        const mouseY = e.pageY
        const moveToX = (mouseY - movingCubeStartY) / 300
        xDeg = getAngle(moveToX) + previousXDeg;

        console.log(xDeg, yDeg)

        let newStyle = `translateZ(-150px) rotateY(-${yDeg}deg) rotateX(${xDeg}deg)`
        document.querySelector(".cube").style.transform = newStyle
    }
}

const handleMouseUp = e => {
    if(isMovingCube) {
        isMovingCube = false
        previousYDeg = yDeg
        previousXDeg = xDeg
    }
}


document.body.addEventListener("mousedown", handleMouseDown)
document.body.addEventListener("mousemove", handleMouseMove)
document.body.addEventListener("mouseup", handleMouseUp)
