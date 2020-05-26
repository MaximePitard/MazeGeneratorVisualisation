class Maze{
	constructor(size){
		this.walls = []
		this.cells = {}
		this.size = size
		this.switched = false
		for (var j = 0; j < size; j+=1) {
			for (var i = 0; i < size; i+=1) {
				this.cells[i+" "+j] = new Cell(i,j,round(width/size))
				
			}
		}
		let starts = []
		for (let cell of Object.values(this.cells)){
			if(cell.x%2 == 0 && cell.y%2 == 0){
				starts.push(cell)
			}
		}
		let start = random(starts)
		start.state = "OPEN"
		start.display()
		this.getWalls(start)

		this.sequence = new Sequence(this.allUnvisited()[0])
		this.currentCell = this.sequence.startPoint
	}

	generate(){
		// if(this.switched){
		// 	this.wilsonAlgorithm()
			
		// }else{
		// 	this.primAlgorithm()
		// }
		this.wilsonAlgorithm()
		this.primAlgorithm()
	}
	wilsonAlgorithm(){
		if(this.currentCell.state =="NOT_VISITED"){
			if((!this.sequence.isVide())){
				if(this.currentCell.directions.length ==0){
					this.currentCell.generateDirections(this.sequence.getPrevDir(),this.currentCell)
				}
			}
			this.removeImpossibleDirections(this.currentCell)
		}

		if(this.currentCell.directions.length == 0){
			if(this.currentCell == this.sequence.startPoint){
				this.currentCell.directions = ['n','o','s','e']
				this.removeImpossibleDirections(this.currentCell)
			}else{
				this.currentCell = this.sequence.getPreviousCell(this.currentCell,this)
			}
		}else{

			let dir = this.currentCell.directions.pop()
			let nextCell = this.getNewCell(this.currentCell,dir,2)
			switch(nextCell.state){
				case "NOT_VISITED":
					this.sequence.addToPath(dir,this)
					this.currentCell = nextCell
					break
				case "OPEN":
					this.sequence.addToPath(dir,this)
					this.currentCell = this.sequence.setAllPathOpen(this)
					break
				case "VISITED":
					this.sequence.eraseLoopCell(this.currentCell,nextCell,this)
					this.currentCell = nextCell
					this.currentCell.display()
			}
		}
	}
	primAlgorithm(){

		if(this.walls.length>0){
			let wall = this.walls.pop()
			let closedCell = this.getclosedCell(wall)
			if(closedCell != undefined){
				wall.state = "OPEN"
				wall.display()
				closedCell.state = "OPEN"
				closedCell.display()
				this.getWalls(closedCell,wall)
			}
			
		// if(this.isSwitch()){
		// 	for(let cell of this.walls){
		// 		cell.state = "NOT_VISITED"
		// 		cell.display()	
		// 	}
		// 	// this.sequence = new Sequence(this.allUnvisited()[0])
		// 	// this.currentCell = this.sequence.startPoint
		// }

		}
	}
	getNewCell(cell,direction,step){
		let newX
		let newY
		switch(direction){
			
					case 'n':
							newX = cell.x
							newY = cell.y -step
						break
					case 's':
							newX = cell.x
							newY = cell.y +step
						break
					case 'o':
							newX = cell.x -step
							newY = cell.y 
						break
					case 'e':
							newX = cell.x +step
							newY = cell.y 
						break
				}
		return this.cells[newX+" "+newY]

	}


	allUnvisited(){
		let arr = []
		for (let cell of Object.values(this.cells)) {
			if (cell.state != "OPEN" && (cell.x%2 == 0 && cell.y%2 == 0)){
				arr.push(cell)
			}
		}
		return arr
	}

	removeImpossibleDirections(cell){
		if(cell.x == 0 || cell.x == this.size -2 ||cell.y == this.size -2 || cell.y == 0){
			let output = []
			for (let dir of cell.directions){
				if(this.getNewCell(cell,dir,2) != undefined){
					output.push(dir)
				}
			}
			cell.directions = output
		}
	}

	getWalls(cell,currentWall){
		
		let newCell
		for(let dir of shuffle(['n','o','s','e'])){
			newCell = this.getNewCell(cell,dir,1)
			if(newCell != undefined && newCell != currentWall){
				this.walls.push(newCell)
			}

		}
	}
	getclosedCell(wall){
		let directions
		let cell1
		let cell2
		if(wall.x %2!= 0){
			directions = ['o','e']
		}else{
			directions = ['n','s']
		}
		
		cell1 = this.getNewCell(wall,directions[0],1)
		cell2 = this.getNewCell(wall,directions[1],1)
		
		if(cell1 != undefined){
			if (cell1.state == "NOT_VISITED"){
				return cell1
			}
		}
		if(cell2 != undefined){
			if (cell2.state == "NOT_VISITED"){
				return cell2
			}
		}
		return undefined
	}

	isSwitch(){
		
		for (var y = 0; y < this.size; y+=2) {
			for (var x = 0; x <this.size; x+=2) {
				if(this.cells[x+" "+y].state == "OPEN"){
					x = 0
					y +=2;
				}
				if(x +2 >= this.size){
					return false
				}
				if(y >= this.size){
					this.switched = true
					return true
				}
			}
		}
	}

}

class Cell{
	constructor(x,y,length){
		this.state = "NOT_VISITED"
		this.x = x
		this.y = y
		this.length = length
		this.directions = []
	}

	display(){
		switch(this.state){
			case "VISITED":
				fill(0,0,255)
				break;

			case "NOT_VISITED":
				fill(0)
				break;

			case "OPEN":
				fill(255)
				break;
		}
		noStroke()
		rect(this.x*this.length+margin,this.y*this.length+margin,this.length)
	}

	generateDirections(prevDir){
		let reverseDir = {
			'o':'e',
			'e':'o',
			'n':'s',
			's':'n'
		}
		let directions = ['n','o','s','e']
	
		for (let direction of directions){
			if(reverseDir[prevDir] != direction){
				this.directions.push(direction)
			}
		}
		
		shuffle(this.directions,true)
	}

}

class Sequence{
	constructor(cell){
		this.startPoint= cell
		this.startPoint.directions = shuffle(['n','o','s','e'],true)
		this.path = []
	}

	isVide(){
		return this.path.length == 0 
	}
	addToPath(dir,maze){
		maze.currentCell.state = "VISITED"
		maze.currentCell.display()
		let wall = maze.getNewCell(maze.currentCell,dir,1)
		wall.state = "VISITED"
		wall.display()
		this.path.push(dir)
	}

	getPrevDir(){
		return this.path[this.path.length -1]
	}

	getPreviousCell(cell, maze){
		cell.state = "NOT_VISITED"
		cell.directions = []
		cell.display()
		let dir = this.getPrevDir()
		let wall = maze.getNewCell(cell,dir,-1)
		wall.state = "NOT_VISITED"
		wall.display()
		this.path.pop()
		return maze.getNewCell(cell,dir,-2)

	}

	setAllPathOpen(maze){
		let cell = this.startPoint
		let wall = undefined

		cell.state = "OPEN"
		cell.display()
		for(let dir of this.path){
			wall = maze.getNewCell(cell,dir,1)
			cell = maze.getNewCell(cell,dir,2)
			wall.state = "OPEN"
			cell.state = "OPEN"
			wall.display()
			cell.display()
			wall.directions = []
			cell.directions = []
		}

		this.startPoint = maze.allUnvisited()[0]
		if(this.startPoint != undefined){
			this.startPoint.directions = shuffle(['n','o','s','e'],true)
			this.path = []
		}else if(this.startPoint == undefined){
			start = false
		}
		return this.startPoint
	}

	eraseLoopCell(cell,loopCell,maze){
		let currentCell = cell
		while(currentCell != loopCell){
			currentCell = this.getPreviousCell(currentCell,maze)
		}
	}
}