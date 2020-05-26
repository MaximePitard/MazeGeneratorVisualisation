
const width = 900
const margin = 10
let maze;
let start = false
let button
let slider

function setup() {
	canvas = createCanvas(width,width)

	canvas.parent('sketch-holder');
	canvas.style('margin','10px')
	background(0)
	button = createButton('generate')
	slider = createSlider(8,300,50,2)
	button.parent('sketch-holder')
	slider.parent('sketch-holder')
	button.mousePressed(generateMaze)
	
	
}

function draw() {
	let value =slider.value()
	document.getElementById("valeur").innerHTML = value;
	if(start){
		maze.generate()	
	}
}

function generateMaze(){
	let size = slider.value()
	resizeCanvas(2*margin+(size-1)*round(width/size),2*margin+(size-1)*round(width/size));
	background(0)
	maze = new Maze(size)
	start = true
}