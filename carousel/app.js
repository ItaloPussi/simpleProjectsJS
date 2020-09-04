const slides = document.querySelectorAll('.slide')
const toLeft = document.querySelector('.left')
const toRight = document.querySelector('.right')

let mytime
let counter = 0;

toLeft.addEventListener('click', function(){
	counter--;
	initializeResetInterval()
	carousel()
})

toRight.addEventListener('click', function(){
	counter++;
	initializeResetInterval()
	carousel()
})

slides.forEach(function(slide, index){
	slide.style.left = `${index*100}%`
})

function carousel(){
	slides.forEach(function(slide, index){
		if(counter==slides.length){
			counter = 0;
		}

		if(counter<0){
			counter = slides.length-1;
		}

		slide.style.transform = `translateX(${-counter*100}%)`
	})

	if(counter==slides.length){
		counter= 0;
	}
}

function initializeResetInterval(){
	clearInterval(myTime)
	myTime = setInterval(function(){
		counter++
		carousel()
	},5000)
}

myTime = setInterval(function(){
	counter++
	carousel()
},5000)
