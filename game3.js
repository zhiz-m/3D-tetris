// CONTROLS: 
// SPACEBAR to timelapse and move the shape down as far as it can go
// ARROW KEYS to move the shape around the grid along the horizontal plane
// Q W, A S, Z X (these keys are all along the left hand side of the keyboard) are used to rotate the shape in certain directions
// 1 and 2 keys are used to rotate the entire grid, for use to aid in viewing

// RULES : (these are the classic Tetris rules, but slightly modified for a 3-D grid)
// Shapes will appear at the top of the grid and gradually fall down towards the bottom. 
// Shapes can be moved and rotated using the controls specified above. 
// When a shape is unable to move further downwards, a new shape will appear. 
// If an entire horizontal row is filled, it will disappear, and the player's score will be increased. 
// If the shapes are stacked up to the very top of the grid, it's game over!

// these are functions used to convert angles in Degrees to Radians.
// I prefer using Degrees, but the programming language renders trigonometry in Radians, so conversion is needed.  
function toRadians(a){
	return a/(180/Math.PI);
}

// these functions are the Sine and Cosine methods that the program utilises. 
function cos(a){
	if (a<0){
		a = -a;
	}
	if (a==90 || a==270){ // Javascript's trigonometric functions do not give 0 as answers, so I must manually add the functionality in. 
		return 0;
	}
	else if (a==0 || a==180 || a==360){ 
		return 1;
	}
	else
		return Math.cos(toRadians(a));
}

function sin(a){
	if (a==0 || a==180 || a == 360 || a==-180 || a==-360) // Javascript's trigonometric functions do not give 0 as answers 	 
		return 0;
	else if (a==90 || a==-270)
		return 1;
	else if (a == -90 || a==270)
		return -1;
	else
		return Math.sin(toRadians(a));
}
	
// this function rotates a set of coordinates around another set of coordinates, and is heavily depended upon later on. 
function rotate(a,b,a2,b2,c){ // this function takes in 2 coordinates and rotates one around the other
	return [(a-a2)*cos(c) - (b-b2)*sin(c)+a2, (b-b2)*cos(c) + (a-a2)*sin(c)+b2];
}

function keyUpHandler(e){
	if (e.keyCode==16){
		shiftPressed = false;
	}
	else if (e.keyCode==82){
		rPressed = false;
	}
}

function keyDownHandler(e) { // this function manages the user's keyboard inputs
	if(e.keyCode == 39) { // each of the numbers are the computer's built-in key codes that are each linked a specific keyboard button. 
			rightPressed = true;
		}
	else if(e.keyCode == 38){
		upPressed = true;
	}
	else if(e.keyCode == 37) {
		leftPressed = true;
	}
	else if(e.keyCode == 40){
		downPressed = true;
	}
	else if(e.keyCode == 32){
		spacePressed = true;
	} 
	else if(e.keyCode == 65){
		aPressed = true;
	}
	else if(e.keyCode == 87){
		wPressed = true;
	}
	else if(e.keyCode == 81){
		qPressed = true;
	}
	else if(e.keyCode == 88){
		xPressed = true;
	}
	else if(e.keyCode == 90){
		zPressed = true;
	}
	else if(e.keyCode == 83){
		sPressed = true;
	}
	else if(e.keyCode == 49){
		onePressed = true;
	}
	else if(e.keyCode == 50){
		twoPressed = true;
	}
	else if(e.keyCode == 80){
		pPressed = true;
	}
	else if (e.keyCode == 16){
		shiftPressed = true;
	}
	else if (e.keyCode == 82){
		rPressed = true;
	}
	if(e.keyCode==38 ||e.keyCode==40 || e.keyCode==32)e.preventDefault();
}

function initShapes(){ // this function creates a scaffold for the structure of each shape. 
	// numbers represent colour. '0' means empty, '1' means red block, '2' means green, '3' means blue, '4' means yellow
	// the first block is the top, left-handside, inner corner 
	// shape 1
	shapes[0] = 
	[[[1],[1]],
	 [[1],[1]]];
	
	// shape 2
	shapes[1] = 
	[[[2],[0]],
	 [[4],[0]],
	 [[2],[4]]];
	 
	// shape 3
	shapes[2] = 
	 [[[0],[4]],
	  [[4],[1]], 
	  [[1],[0]]];
	
	// shape 4

	shapes[3] = 
	 [[[3,0],[0,0]],
	  [[2,3],[3,0]]]
	// shape 5
	shapes[4] = 
	[[[3]],[[3]],[[3]],[[3]]];
	
	// shape 6
	shapes[5] = 
	[[[1],[0]],
	 [[3],[1]],
	 [[1],[0]]];
	
	// shape 7
	shapes[6] = 
	[[[3,4],[0,0]],
	 [[4,0],[3,0]]]
}

function loadNextShape(){ // when a new shape is loaded, this updates the "Next Shape" panel. 
	define=true;
	var id = grid.nextShapeId;
	var gridSize;
	if (id ==0){
		gridSize = [2,2,1];
	}
	else if (id == 1 || id==2 ||id==5){
		gridSize = [3,2,1];
	}
	else if (id == 4){
		gridSize = [4,1,1];
	}
	else if(id == 3 || id == 6){
		gridSize = [2,2,2];
	}
	grid2 = new Grid(gridSize);
	shape2 = new Shape(grid.nextShapeId,[0,0,0],grid2);
	var prevAngle;
	if (rotation2!=null)
		prevAngle = rotation2.vAngleA;
	else 
		prevAngle=50;
	rotation2 = new Rotation(grid2,prevAngle);
	shapeList= shape2.shapeList;
	for (var i=0;i<shapeList.length;i++){
		grid2.modPointValue(shapeList[i][0],shapeList[i][1],shapeList[i][2],shapeList[i][3]);
	}
}

function tickNextShape(){ // this separately rotates the "Next Shape" panel's grid. 
	rotation2.vRotate(7);
}

function draw(){ // this function collates together all of the functions that draw onto the screen. 
	var displacementX = 0;
	var displacementY = 0;
	var scale = 60;
	ctx.fillStyle = 'rgb(238,238,238)';
	ctx.fillRect(0, 0, screenWidth, screenHeight);
	
	grid.draw(); // draws the game grid by calling one of the 'draw' functions
	if (define)grid2.draw(280,150,40); // draws the 'Next Shape' panel by calling one of the 'draw' functions 
	
	ctx.textAlign= "center";
	ctx.fillStyle = "black";
	ctx.globalAlpha = "1"
	ctx.font = "25px arial"; // sets the font and font size
	ctx.fillText("Next Shape:", 380,100);
	
	ctx.font = "25px arial";
	ctx.fillText("Score: "+score, 380,300);
	ctx.font = "17px arial";
	ctx.fillText("(Press P to Pause /",400,460);
	ctx.fillText("Show Controls)", 420, 475);
	ctx.font = "20px arial";
	ctx.fillText("Zhizhou Ma 1009", 400, 510);
	ctx.font = "18px arial";
	ctx.fillText("PP 2017 Sem 2", 410, 535);
	if (paused){
		drawPausedScreen();
	}
	if (gameOver){
		drawGameOverScreen();
	}
}

function drawPausedScreen(){
	var xBorder = 45;
	var yBorder = 50;
	var y = xBorder + 30;
	var y2 = y+30;
	var i = 30;
	ctx.globalAlpha = 0.9;
	ctx.fillStyle = "grey";
	ctx.fillRect(xBorder,yBorder, screenWidth-2*xBorder, screenHeight-2*yBorder);
	
	ctx.fillStyle = "black";
	ctx.globalAlpha = 1;
	ctx.font = "30px arial"; // sets the font and font size
	ctx.fillText("Controls:", screenWidth/2, y);
	ctx.font = "20px arial"
	ctx.fillText("P to pause/unpause", screenWidth/2, y2);
	ctx.fillText("Arrow keys to move shape", screenWidth/2, y2+i);
	ctx.fillText("Q,W,A,S,Z,X to rotate shape", screenWidth/2, y2+i*2);
	ctx.fillText("Spacebar for shape to fall straight down", screenWidth/2, y2+i*3);
	ctx.fillText("Hold shift to speed blocks up", screenWidth/2, y2+i*4);
	ctx.fillText("1 and 2 keys to rotate view", screenWidth/2, y2+i*5);
}

function drawGameOverScreen(){
	var xBorder = 45;
	var yBorder = 50;
	ctx.globalAlpha = 0.85;
	ctx.fillStyle = "grey";
	ctx.fillRect(xBorder,yBorder, screenWidth-2*xBorder, screenHeight-2*yBorder);
	ctx.fillStyle = "black";
	ctx.globalAlpha = 1;
	ctx.font = "40px arial";
	ctx.fillText("Game Over!", screenWidth/2, screenHeight/2-50);
	ctx.font = "30px arial";
	ctx.fillText("Final Score: "+score, screenWidth/2, screenHeight/2);
	ctx.fillText("Press R to play again", screenWidth/2, screenHeight/2+50);
}

function loop(){ // this is the primary loop that the program continuously runs to update the game. 
	if (!paused && !gameOver){
		if (shiftPressed){
			timerSpeed = Math.floor((gameSpeed/programSpeed)/5);
		}
		else {
			timerSpeed = Math.floor(gameSpeed/programSpeed);
		}
		if (timer >= timerSpeed){ // to save processing power, the game is only rendered on certain frames, so a timer is used. 
			grid.gameRendering();
			timer = 0;
		}
		shape.move();
		if (spacePressed){ // this block of code and the ones below it are triggered whenever a certain key is pressed. 
			spacePressed = false;
			shape.shiftBottom();
			shape.loadToGrid();
			timer = JSON.parse(JSON.stringify(timerSpeed)); // resets the timer so that the next frame is rendered instantly
			render = true;
		}
		if (qPressed){
			shape.rotate("left"); // for example, when 'q' is pressed, the shape is rotated left. 
			rotateLogic = true;
		}
		else if (wPressed){
			shape.rotate("right");
			rotateLogic = true;
			
		}
		else if (aPressed){
			shape.rotate("in");
			rotateLogic = true;
			
		}
		else if (sPressed){
			shape.rotate("out");
			rotateLogic = true;
			
		}
		else if (zPressed){
			shape.rotate("clockwise");
			rotateLogic = true;
			
		}
		else if (xPressed){
			shape.rotate("c-clockwise");
			rotateLogic = true;
			
		}
		if (onePressed){ // when 1 or 2 are pressed, the grid is rotated. 
			rotation.vRotate(rotateConstant);
			rotateLogic = true;
			
		}
		else if (twoPressed){
			rotation.vRotate(-rotateConstant);
			rotateLogic = true;
		}
		
		if (rotateLogic){
			render = true;
		}
		
		timer ++;		 	 
		tickNextShape(); 
	}
	if (pPressed && !gameOver){
		if (paused)
			paused = false;
		else 
			paused = true;
	}
	if (gameOver){
		if (rPressed){
			loadGame();
		}
	}
	qPressed = false; // at the end of the loop, the programs sets the 'pressed' status of all of the keys to false, 
					// so that their respective blocks of code will not be run afterwards when the keys are released.
	wPressed = false;
	twoPressed = false;
	onePressed = false;
	xPressed = false;
	zPressed = false;
	sPressed = false;
	aPressed = false;
	pPressed = false;
	draw();
}

class Rotation { // this is a class (basically, a larger function) that is responsible for the grid's rotation and 3-D projection. 
	constructor(g=grid,r=50){
		this.visiblePoints;
		this.grid = g;
		this.grid.rotation = this;
		this.pov = [5,12,-20];
		this.planeZ = -5;
		this.gridCentre = [g.gridSize[0]/2,g.gridSize[1]/2,g.gridSize[2]/2];
		this.relativePlane;
		this.projectedList;
		this.skimmedProjectedList;
		this.colorList;
		this.vAngleA = r;
	}
	vRotate(a){ // this function is called when the grid is rotated
		this.vAngleA += a; // the angle variable is increased by the amount specified in the parameters 
		if (this.vAngleA%90 ==0){
			this.vAngleA+=1;
		}
		if (this.vAngleA < 0){ // if the angle is larger than 360 or smaller than 0, the program will convert it into a number between those two degrees. 
			this.vAngleA += 360;
		}
		else if (this.vAngleA > 360){
			this.vAngleA -= 360;
		}
		if(a>0){ 
			if (0<this.vAngleA &&this.vAngleA<12) 	// certain angles are problematic and result in graphics errors, 
													// which these blocks of code aim to prevent.
				this.vAngleA=13;
			else if (90<this.vAngleA &&this.vAngleA<102)
				this.vAngleA=103;
			else if (180<this.vAngleA &&this.vAngleA<192)
				this.vAngleA=193;
			else if (270<this.vAngleA &&this.vAngleA<282)
				this.vAngleA=283;
		}
		else if(a<=0){
			if (0<this.vAngleA &&this.vAngleA<12)
				this.vAngleA=359;
			else if (90<this.vAngleA &&this.vAngleA<102)
				this.vAngleA=87;
			else if (180<this.vAngleA &&this.vAngleA<192)
				this.vAngleA=167;
			else if (270<this.vAngleA &&this.vAngleA<282)
				this.vAngleA=257;
		}
	}
	getProjectedPoints(){
		return this.projectedList;
	}
	setRelativePlane(){ // basically, this function rotates the grid
		var points = [];
		this.visiblePointsList =[];
		var pointList = [];
		var newPointList = [];
		var pointList2 = [];
		var newPointList2 = [];
		this.relativePlane = [];
		var t = this.getVisibleNums();
		
		// it can be noted that the code shown below is repeated 4 times in total to cater for the different angles. 
		// this is to ensure that the list is constructed in the required order such that blocks at the back of the grid are masked by the ones in front. 
		
		if ((this.vAngleA >0 && this.vAngleA <90)){ 
			for (var j=0;j<this.grid.gridSize[1];j++){ // the code loops through each of the points in the grid...
				for (var i=t[0];i>t[1];i+=t[2]){
					for (var k=t[3];k>t[4];k+=t[5]){
						if (j<=9){
							points.push([i,j,k, this.grid.getPointValue(i,j,k)]); // and processes it into a new list. 
						}
					}
				}
			}
		}
		else if ((this.vAngleA >90 && this.vAngleA <180)){
			for (var j=0;j<this.grid.gridSize[1];j++){
				for (var i=t[0];i>t[1];i+=t[2]){
					for (var k=t[3];k<t[4];k+=t[5]){
						if(j<=9)points.push([i,j,k, this.grid.getPointValue(i,j,k)])
					}
				}
			}
		}
		else if ((this.vAngleA >180 && this.vAngleA <270)){
			for (var j=0;j<this.grid.gridSize[1];j++){
				for (var i=t[0];i<t[1];i+=t[2]){
					for (var k=t[3];k<t[4];k+=t[5]){
						if(j<=9)points.push([i,j,k, this.grid.getPointValue(i,j,k)])
					}
				}
			}
		}
		else if ((this.vAngleA >270 && this.vAngleA <360)){
			for (var j=0;j<this.grid.gridSize[1];j++){
				for (var i=t[0];i<t[1];i+=t[2]){
					for (var k=t[3];k>t[4];k+=t[5]){
						if(j<=9)points.push([i,j,k, this.grid.getPointValue(i,j,k)])
					}
				}
			}
		}
		for (var a=0;a<points.length;a++){ // produces a list with the coordinates of all of the cubes' vertices
			var x = points[a][0];
			var y = points[a][1];
			var z = points[a][2];
			var colour = points[a][3];
			var p1 = [x,y,z];
			var p2 = [x + 1, y, z];
			var p3 = [x + 1, y, z + 1];
			var p4 = [x, y, z + 1];
			var p5 = [x, y + 1, z];
			var p6 = [x + 1, y + 1, z];
			var p7 = [x + 1, y + 1, z + 1];
			var p8 = [x, y + 1, z + 1];
			pointList.push([p1,p2,p3,p4,p5,p6,p7,p8,colour]); // each of the points are added to a new list
		}
		for (var i=0;i<pointList.length;i++){ // utilises the rotation functions to create the new, modified points
			var newList = [];
			for (var j=0;j<8;j++){
				var x = pointList[i][j][0];
				var y = pointList[i][j][1];
				var z = pointList[i][j][2];
				var listXZ = rotate(x,z,this.gridCentre[0],	// using the rotation function created earlier, the points are converted into new, rotated coordinates. 
					this.gridCentre[2],this.vAngleA); 
				var listZY = rotate(listXZ[1],y,this.gridCentre[2],this.gridCentre[1],0);
				newList.push([listXZ[0],listZY[1],listZY[0]]); // once the rotations are complete, the coordinates are added to another list. 
			}
			newList.push(pointList[i][8]);
			newPointList.push(newList);
		}
		this.relativePlane = JSON.parse(JSON.stringify(newPointList)); // finally, the code changes the current relative plane to the newly created list
	}
	setProjectedPoints(){ 	// This is the function that actually 3-D projects the points. 
							// It's fairly short because most of the required values have already been defined elsewhere.
		var povX = this.pov[0];
		var povY = this.pov[1];
		var povZ = this.pov[2];
		var planeZ = this.planeZ;
		this.projectedList = [];
		this.skimmedProjectedList=[];
		for (var i=0;i<this.relativePlane.length;i++){
			var list = [];
			var list2=[];
			for (var j=0;j<this.relativePlane[i].length-1;j++){// This code runs once for each of the vertices for each of the cubes. 
				var points = this.relativePlane[i][j];
				var scalar = (planeZ-povZ)/(points[2]-povZ);// The most important section of this loop: 
															// it is the ratio that converts the 3-D points into 2-D points. 
				var XZpoint = [povX + (points[0]-povX)*scalar,povY + (points[2]-povZ)*scalar]
				var XZdist = Math.sqrt((points[2]-povZ)^2+(points[0]-povX));
				var Ypoint = (points[1] - povY) * scalar;
				list.push([XZpoint[0], Ypoint]); // the points have been converted and are added to yet another list. 
				if (this.relativePlane[i][8]!=0)
					list2.push([XZpoint[0], Ypoint]);
			}
			list.push(this.relativePlane[i][8]);
			this.projectedList.push(list); // the smaller lists are combined to form a larger list. 
			
			if (this.relativePlane[i][8]!=0){
				list2.push(this.relativePlane[i][8]);
				this.skimmedProjectedList.push(list2); // a separate list is constructed to store the non-empty grid coordinates. 
			}
		}
	}
	getColourList(){
		return this.colourList;
	}
	setColourPoints(){ 	// for the different rotational angles, and for each non-empty point, 
						// the required coordinates needed for drawing onto the screen are set. 
		var a =this.skimmedProjectedList;
		this.colourList = [];
		for (var i=0;i<this.skimmedProjectedList.length;i++){
			if ((this.vAngleA >0 && this.vAngleA <90)){
				this.colourList.push([[a[i][4],a[i][5],a[i][6],a[i][7]],[a[i][0],a[i][1],a[i][5],a[i][4]],[a[i][0],a[i][3],a[i][7],a[i][4]]]);
			}
			else if ((this.vAngleA >90 && this.vAngleA < 180)){
				this.colourList.push([[a[i][4],a[i][5],a[i][6],a[i][7]],[a[i][2],a[i][3],a[i][7],a[i][6]],[a[i][0],a[i][3],a[i][7],a[i][4]]]);
			}
			else if ((this.vAngleA >180 && this.vAngleA < 270)){
				this.colourList.push([[a[i][1],a[i][2],a[i][6],a[i][5]],[a[i][2],a[i][3],a[i][7],a[i][6]],[a[i][4],a[i][5],a[i][6],a[i][7]]]);
			}
			else if ((this.vAngleA >270 && this.vAngleA < 360)){
				this.colourList.push([[a[i][4],a[i][5],a[i][6],a[i][7]],[a[i][0],a[i][1],a[i][5],a[i][4]],[a[i][1],a[i][2],a[i][6],a[i][5]]]);
			}
		}
	}
	
	getVisibleNums(){ // this function basically returns some numbers that the program uses to process the different lists. 
		var a = this.grid.gridSize;
		if ((this.vAngleA >0 && this.vAngleA <90)){
			return [a[0]-1,-1,-1,a[2]-1,-1,-1];
		}
		else if ((this.vAngleA >90 && this.vAngleA < 180)){
			return [a[0]-1,-1,-1,0,a[2],1];
		}
		else if ((this.vAngleA >180 && this.vAngleA < 270)){
			return [0,a[0],1,0, a[2], 1];
		}
		else if ((this.vAngleA >270 && this.vAngleA < 360)){
			return [0,a[0],1,a[2]-1,-1,-1];
		}
	}
}

class Grid{ // this class stores the data used to define the grid, and all of the different functions used to modify and draw it. 
	constructor(x=[gridX,gridY,gridZ]){
		this.gridList = [];
		this.gridSize = x;
		this.rotation;
		this.shapeNeeded = true;
		this.nextShapeId;
		this.initGrid(x[0], x[1], x[2]);
		initShapes();
	}
	
	getPointValue (x, y, z){ // this function returns the colour value of a specific set of coordinates. 
		return this.gridList[x][y][z];
	}
	modPointValue (x, y, z, value){ // this function allows for the modification of the colour of a specific coordinate. 
		this.gridList[x][y][z] = value;
	}
	draw(displacementX=0,displacementY=0,scale=60){ // this actually draws the grid onto the screen. 
	
		this.rotation.setRelativePlane(); // the different functions in the Rotation function, seen earlier, are used to draw the grid. 
		this.rotation.setProjectedPoints();
		this.rotation.setColourPoints();
		
		var points = this.rotation.getProjectedPoints(); // this defines a couple of new lists that the code uses to perform drawing. 
		var colour = this.rotation.getColourList();
		var skimList = this.rotation.skimmedProjectedList;
		ctx.globalAlpha = 1;
		if (this.rotation==rotation){ // this draws the black borders around the squares forming the base of the grid. 
			ctx.lineWidth= 2;
			ctx.strokeStyle = "grey";
			ctx.beginPath();
			for (var i=0;i<this.gridSize[0]*this.gridSize[2]; i++){
				ctx.moveTo(points[i][0][0]*scale+displacementX,-(points[i][0][1]*scale+displacementY));
				ctx.lineTo(points[i][1][0]*scale+displacementX,-(points[i][1][1]*scale+displacementY));
				ctx.lineTo(points[i][2][0]*scale+displacementX,-(points[i][2][1]*scale+displacementY));
				ctx.lineTo(points[i][3][0]*scale+displacementX,-(points[i][3][1]*scale+displacementY));
				ctx.lineTo(points[i][0][0]*scale+displacementX,-(points[i][0][1]*scale+displacementY));
			};
			ctx.closePath();
			ctx.stroke();
		}
		 // these set the width of the line and the transparency level. 
		ctx.lineWidth = 1;
		for (var i=0;i<colour.length;i++){ 
			if (skimList[i][8]==1){ 
				ctx.fillStyle = "red";// sets the colour used to fill the shapes
			}
			else if (skimList[i][8]==2)
				ctx.fillStyle= "green";
			else if (skimList[i][8]==3)
				ctx.fillStyle="blue";
			else if (skimList[i][8]==4)
				ctx.fillStyle="yellow"
			for (var j=0;j<3;j++){
				ctx.beginPath();
				for (var k=0;k<4;k++){ // loops through each point in each visible face of each shape... 
					ctx.lineTo(colour[i][j][k][0]*scale+displacementX,-(colour[i][j][k][1]*scale+displacementY)); // and paints them onto the screen. 
				}
				ctx.closePath();
				ctx.fill();
			}	
			
			ctx.lineWidth=1; // sets the width and colour of the lines
			ctx.strokeStyle="black";
			ctx.beginPath();
			for (var j=0;j<3;j++){ // this again loops through each point in each face of each block in the grid, and draws their outline. 
				ctx.moveTo(colour[i][j][0][0]*scale+displacementX,-(colour[i][j][0][1]*scale+displacementY));
				for (var k=0;k<4;k++)
					ctx.lineTo(colour[i][j][k][0]*scale+displacementX,-(colour[i][j][k][1]*scale+displacementY));
				ctx.lineTo(colour[i][j][0][0]*scale+displacementX,-(colour[i][j][0][1]*scale+displacementY));	
			}
			ctx.closePath();
			ctx.stroke();
		}
		if (this.rotation==rotation){
			ctx.beginPath();
			ctx.strokeStyle="grey"; // this again sets the line's colour, transparency, and width
			ctx.globalAlpha = 0.1;
			ctx.lineWidth=1;
			for (var i=0;i<points.length;i++){ // this loops through each point in the grid and draws the transparent grey outline. 
				if (points[i][8]==0){
					ctx.moveTo(points[i][0][0]*scale+displacementX,-(points[i][0][1]*scale+displacementY));
					ctx.lineTo(points[i][1][0]*scale+displacementX,-(points[i][1][1]*scale+displacementY));
					ctx.lineTo(points[i][2][0]*scale+displacementX,-(points[i][2][1]*scale+displacementY));
					ctx.lineTo(points[i][3][0]*scale+displacementX,-(points[i][3][1]*scale+displacementY));
					ctx.lineTo(points[i][0][0]*scale+displacementX,-(points[i][0][1]*scale+displacementY));
					ctx.lineTo(points[i][4][0]*scale+displacementX,-(points[i][4][1]*scale+displacementY));
					ctx.lineTo(points[i][5][0]*scale+displacementX,-(points[i][5][1]*scale+displacementY));
					ctx.lineTo(points[i][6][0]*scale+displacementX,-(points[i][6][1]*scale+displacementY));
					ctx.lineTo(points[i][7][0]*scale+displacementX,-(points[i][7][1]*scale+displacementY));
					ctx.lineTo(points[i][4][0]*scale+displacementX,-(points[i][4][1]*scale+displacementY));
					
					ctx.moveTo(points[i][0][0]*scale+displacementX,-(points[i][0][1]*scale+displacementY));
					ctx.lineTo(points[i][4][0]*scale+displacementX,-(points[i][4][1]*scale+displacementY));
					ctx.moveTo(points[i][1][0]*scale+displacementX,-(points[i][1][1]*scale+displacementY));
					ctx.lineTo(points[i][5][0]*scale+displacementX,-(points[i][5][1]*scale+displacementY));
					ctx.moveTo(points[i][2][0]*scale+displacementX,-(points[i][2][1]*scale+displacementY));
					ctx.lineTo(points[i][6][0]*scale+displacementX,-(points[i][6][1]*scale+displacementY));
					ctx.moveTo(points[i][3][0]*scale+displacementX,-(points[i][3][1]*scale+displacementY));
					ctx.lineTo(points[i][7][0]*scale+displacementX,-(points[i][7][1]*scale+displacementY));
				}
			}
			ctx.closePath();
			ctx.stroke();
		}
	}
	checkGameOver(){
		for (var i=0;i<this.gridSize[0];i++){
			for (var j=0;j<this.gridSize[1];j++){
				for (var k=0;k<this.gridSize[2];k++){
					if (j>9 && this.getPointValue(i,j,k)!=0)
						gameOver = true;
				}
			}
		}
	}
	checkFilledRow(){ // this checks and removes filled rows. 
		var count;
		var total = this.gridSize[0]*this.gridSize[2]; // the total is the amount of blocks per row. 
		for (var j=this.gridSize[1]-1;j>=0;j--){
			count=0;
			for (var i=0;i<this.gridSize[0];i++){ // looping through each block in each row, 
				for (var k=0;k<this.gridSize[2];k++){
					if (this.getPointValue(i,j,k) != 0) 
						count++
					if (count == total){ // for each row, if the amount of non-empty blocks is equal to the total (aka, the row is filled), 
						score++;
						this.removeFilledRow(j); // the removeFilledRow function is called (shown below). 
					}
				}
			}
		}
	}
	removeFilledRow(y){ // the removeFilledRow function
		var copy = JSON.parse(JSON.stringify(this.gridList)); // a copy of the grid is made
		for (var i=0;i<this.gridSize[0];i++) // looping through each block in the row, 
			for (var k=0;k<this.gridSize[2];k++){
				copy[i][y][k] = 0; // each block in the row is set to empty 
			}
		if (y < this.gridSize[1]){	
			for (var i=0;i<this.gridSize[0];i++) // looping through each block in the grid, 
				for (var j=y+1;j<this.gridSize[1];j++)
					for (var k=0;k<this.gridSize[2];k++){
						copy[i][j-1][k] = this.getPointValue(i,j,k); // each block in the grid is then shifted downwards. 
					}
		}
		this.gridList=copy; // the grid is updated with the newly modified 'copy' list. 
		
	}
	initGrid(x, y, z){ // when the grid is created, this function is called to create a list that stores the value of each point. 
		for (var i=0; i<x; i++){
			var gridListY = []
				for (var j=0; j<y; j++){
					var gridListZ = [];
					for (var l=0; l<z; l++){
						gridListZ.push(0);
					}
					gridListY.push(gridListZ);
				}
			this.gridList.push(gridListY);
		}
	}

	loadShape(){ // this function is called whenever a new shape needs to appear
		if (this.nextShapeId == null){ // if there is no "Next Shape", random objects for the "Current" and "Next" shapes are created. 
			this.nextShapeId = Math.floor(Math.random()*shapes.length);
			shape = new Shape(Math.floor(Math.random()*shapes.length));
		}
		else{ // otherwise, the current shape becomes that of the "Next Shape", and it gets reset. 
			shape = new Shape(this.nextShapeId);
			this.nextShapeId = Math.floor(Math.random()*shapes.length);
		}
		loadNextShape(); // the "Next Shape" panel is updated. 
		if (this.rotation == rotation){
			this.checkGameOver();
		}
	}
	gameRendering(){ // this is looped over and over again to update the game. 
	
		if (this.shapeNeeded){ // if a shape is needed, the LoadShape function is called. 
			this.loadShape();
			this.shapeNeeded = false;
		}
		else{
			shape.tick(); // this function is responsible for moving the shape downwards. 
			this.checkFilledRow(); // after the shape is moved, the game checks to see if a row is filled. 
		}
		render = true; // specifies that the screen needs to be re-drawn. 
	}
}

class Shape { // this class stores the necessary functions and variables used to manage the game's shapes. 
	constructor(id, s=shapeStart, g=grid){ 
		this.shapeId = id;
		this.shapeList = [];
		this.initShape(s, shapes[id]);
		this.grid = g;
	}
	initShape(point, a){ // the shape is first defined using an object in the scaffold list, shown earlier. 
		this.shapeList = [];
		for (var i=0;i<a.length;i++){ // this loops through each item in the scaffold object... 
			for (var j=0;j<a[i].length;j++){
				for (var k=0;k<a[i][j].length;k++){
					if (a[i][j][k]!=0)
						this.shapeList.push([point[0]+i,point[1]+j,point[2]+k,a[i][j][k]]); // and adds it to another list. 
				}
			}
		}
	}
	getMovementNums(){ // this function returns a list of numbers, depending on the angle, that help the program render key movement. 
		var list;
		var a = this.grid.rotation.vAngleA;
		if (a >45 && a<=135){
			list = [0,1,0,-1,2,1,2,-1]
		}
		else if (a >135 && a<= 225){
			list = [2,-1,2,1,0,1,0,-1];
		}
		else if (a>225 && a<= 315){
			list = [0,-1,0,1,2,-1,2,1];
		}
		else if (a>315 || a<= 45){
			list = [2,1,2,-1,0,-1,0,1];
		}
		return list;
	}
	shapeIntersects(a=this.shapeList){
		for (var i=0;i<a.length;i++){
			if (this.grid.getPointValue(a[i][0],a[i][1],a[i][2])!=0)
				return true;
		}
		return false;
	}
	shapeInGrid(a=this.shapeList){
		for (var i=0;i<a.length;i++){
			if (a[i][0]<0 || a[i][0]>=this.grid.gridSize[0] || a[i][1]<0 || a[i][1]>=this.grid.gridSize[1] || a[i][2]<0 || a[i][2]>=this.grid.gridSize[2])
				return false;
		}
		return true;
	}
	move(){ // controls the shape's movement
		var copy = JSON.parse(JSON.stringify(this.shapeList));
		var l = this.getMovementNums();
		var process = false;

		if (upPressed){ // if any of the arrow keys are pressed, the game will move the shape in a direction. 
			for (var i=0;i<this.shapeList.length;i++){
				copy[i][l[0]]+=l[1]; 	// for example, when the 'up' key is pressed, 
										// the shape will move in a certain direction, depending on the angle. 
			}
			process= true;
		}
		else if (downPressed){
			for (var i=0;i<this.shapeList.length;i++){
				copy[i][l[2]]+=l[3];
			}
			
			process= true;
		}
		else if (leftPressed){
			for (var i=0;i<this.shapeList.length;i++){
				copy[i][l[4]]+=l[5];
			}
			
			process= true;
		}
		else if (rightPressed){
			for (var i=0;i<this.shapeList.length;i++){
				copy[i][l[6]]+=l[7];
			}
			
			process= true;
		}
		this.removeFromGrid();
		if (process && this.shapeInGrid(copy)){
			if (!this.shapeIntersects(copy)){
				this.shapeList = copy;
			}
		}
		this.loadToGrid();
		upPressed = false;
		downPressed =false;
		leftPressed = false;
		rightPressed=false;
		// at the end of the function, the status of all the arrow keys are set to false, so that the code will not run after the keys are released. 
	}
	rotate(direction){ // function to rotate the shape 90 degrees in a direction. 
		this.removeFromGrid();
		var centrePoint = this.shapeList[transformList[this.shapeId]]; // the centre point for the rotation is acquired and stored in a variable
		var copy = JSON.parse(JSON.stringify(this.shapeList)); // two copies of the class's shapeList are stored for later use 
		var copy2 = JSON.parse(JSON.stringify(this.shapeList));
		var allowed=true;
		try{
			for (var i=0;i<this.shapeList.length;i++){ 	// for each of the different directions, the shape is rotated in a certain direction.
														// each time, two of the x, y and z variables are modified. 
				var p = this.shapeList[i];
				var list;
				if (direction=="left"){  // for the 'left' and 'right' rotations, the x and z coordinate values are changed. 
					list = rotate(p[0],p[2],centrePoint[0],centrePoint[2],90);
					copy[i][0] = list[0];
					copy[i][2] = list[1];
					
				}
				else if (direction=="right"){
					list = rotate(p[0],p[2],centrePoint[0],centrePoint[2],-90);
					copy[i][0] = list[0];
					copy[i][2] = list[1];
				}
				else if (direction=="in"){ // for the 'in' and 'out' rotations, the y and z coordinates are modified. 
					list = rotate(p[2],p[1],centrePoint[2],centrePoint[1],-90);
					copy[i][1] = list[1];
					copy[i][2] = list[0];
				}
				else if (direction=="out"){
					list = rotate(p[2],p[1],centrePoint[2],centrePoint[1],90);
					copy[i][1] = list[1];
					copy[i][2] = list[0];
				}
				if (direction=="clockwise"){ // for the 'clockwise' and 'c-clockwise' rotations, the x and y coordinates are modified. 
					list = rotate(p[0],p[1],centrePoint[0],centrePoint[1],-90);
					copy[i][0] = list[0];
					copy[i][1] = list[1];
				}
				if (direction=="c-clockwise"){
					list = rotate(p[0],p[1],centrePoint[0],centrePoint[1],90);
					copy[i][0] = list[0];
					copy[i][1] = list[1];
				}
			}
		}catch(e){ // if the above code cannot be executed (eg, the shape would move out of the grid's boundaries) it is immediately terminated. 
		}
		
		// the code makes final checks to ensure the rotations are valid. 
		if (this.shapeInGrid(copy)){ // this checks whether the new shape lies within the grid's boundaries
			if (this.shapeIntersects(copy)) // this checks whether the new shape intersects with other blocks
				allowed = false;
		}else 
			allowed = false;
		/*
		for (var i=0;i<copy.length;i++){ 
			if (copy[i][0]<0 || copy[i][0] >=gridX || copy[i][1]<0 || copy[i][1] >=gridY || copy[i][2]<0 || copy[i][2] >=gridZ){
				
				allowed = false;
				break;
			}
			else if (this.grid.getPointValue(copy[i][0],copy[i][1],copy[i][2]) != 0)
				
				allowed = false;
		}
		*/
		if (allowed){ // lastly, if the list passes all of the validation tests, the shapeList list is replaced by the newly created list. 
			this.shapeList = copy;
			for (var i=0;i<this.shapeList.length;i++){
				grid.modPointValue(copy2[i][0],copy2[i][1],copy2[i][2],0);
			}
		}	
		this.loadToGrid();
	}
	shiftDown(){ // this is called to move the shape downwards. 
		this.removeFromGrid();
		for (var i=0;i<this.shapeList.length;i++){ // the y coordinate for each block in the shape is reduced by 1. 
			this.shapeList[i][1]-=1;
		}
		this.loadToGrid();
	}
	loadToGrid(a=this.shapeList){ // this function updates the grid by copying the shape's coordinates into it. 
		for (var i=0;i<a.length;i++){
			grid.modPointValue(a[i][0],a[i][1],a[i][2],a[i][3]);
		}
	}
	removeFromGrid(a=this.shapeList){ // this function removes all coordinates of the shape from the grid. 
		for (var i=0;i<a.length;i++){
			grid.modPointValue(a[i][0],a[i][1],a[i][2],0);
		}
	}
	ableMove(){ // this checks if the shape is able to move downwards. 
		this.removeFromGrid();
		var s=true;
		try{
			for (var i=0;i<this.shapeList.length;i++){ 	// it loops through each of the shape's coordinates...  
				if (grid.getPointValue(this.shapeList[i][0],
					this.shapeList[i][1]-1,this.shapeList[i][2])!= 0) // and checks whether the point below it is empty.
					s = false;
			}
		}catch(e){return false;}
		this.loadToGrid();
		return s;
	}
	ableShift(a){ // this checks whether the shape is able to move in a certain direction. 
		this.removeFromGrid();
		var able = true;
		var l = this.shapeList;
		var list = this.getMovementNums;
		try{
			if (a=="left"){
				for (var i=0;i<this.shapeList.length;i++){ // it makes sure that the shape's new coordinates are all empty. 
					if (grid.getPointValue(l[i][0]-1,l[i][1],l[i][2])!=0)able= false;
				}
			}
			else if (a=="right"){
				for (var i=0;i<this.shapeList.length;i++){
					if (grid.getPointValue(l[i][0]+1,l[i][1],l[i][2])!=0)able= false;
				}
			}
			else if (a=="up"){
				for (var i=0;i<this.shapeList.length;i++){
					if (grid.getPointValue(l[i][0],l[i][1],l[i][2]+1)!=0)able= false;
				}
			}
			else if (a=="down"){
				for (var i=0;i<this.shapeList.length;i++){
					if (grid.getPointValue(l[i][0],l[i][1],l[i][2]-1)!=0)able= false;
				}
			}
		}catch(e){
			able=false;
		}
		for (var i=0;i<this.shapeList.length;i++){
			if (grid.getPointValue(this.shapeList[i][0],this.shapeList[i][1],this.shapeList[i][2])!=0) able=false;
		}
		this.loadToGrid();
		return able;
	}
	shiftBottom(){ // this function shifts the shape to the bottom of the grid. 
		while (this.ableMove()){
			this.shiftDown();
		}
	}
	tick(){ // this function manages the flow of the game by actually calling the other functions. 
		if (this.ableMove()){
			this.shiftDown();
		}
		else {
			this.loadToGrid();
			grid.loadShape();
		}
	}
}

// from here onwards, most of the code is used to define different lists or variables. 

function loadGame(){
	nextShapeId = null;
	currentShape = null;
	shapeNeeded = true;
	
	leftPressed = false; // these are the variables used to manage the user's keyboard input. 
	rightPressed = false;
	upPressed = false;
	downPressed = false;
	spacePressed = false;
	aPressed = false;
	wPressed = false;
	qPressed = false;
	sPressed = false;
	zPressed = false;
	xPressed = false;
	onePressed = false;
	twoPressed = false;
	pPressed = false;
	shiftPressed = false;
	rPressed = false;
	
	paused = false;
	gameOver = false;
	
	render = true;
	
	grid = new Grid(); // these 6 objects are the Grid, Rotation, and Shape classes used to run the game. 
	grid2 = undefined;
	rotation = new Rotation(grid);
	rotation2 = undefined;
	shape = undefined;
	shape2 = undefined;
	
	score = 0;
	define = false;
	
	rotateLogic = true;
	timer = JSON.parse(JSON.stringify(actTimerSpeed));
}

var nextShapeId; // these are the variables used to manage the shapes. 
var currentShape;
var shapeNeeded;

var leftPressed; // these are the variables used to manage the user's keyboard input. 
var rightPressed;
var upPressed;
var downPressed;
var spacePressed;
var aPressed;
var wPressed;
var qPressed;
var sPressed;
var zPressed;
var xPressed;
var onePressed;
var twoPressed;
var pPressed;
var shiftPressed;
var rPressed;

var paused = false;
var gameOver = false;

var gridX = 4 // these variables define the size of the grid. 
var gridY = 12
var gridZ = 4

var render; // this variable defines whether the game needs to be re-drawn. 

var c = document.getElementById("theCanvas"); 	// these variables are references to the physical screen that is drawn upon. 
var ctx = c.getContext("2d");					// you can see that most of the drawing is done by calling a function following the term "ctx". 

var screenWidth = 500; // these variables define the resolution of the screen. 
var screenHeight = 550;

c.width = screenWidth; // these commands actually convert the canvas' resolution to the desired amount. 
c.height = screenHeight;

var shapes = []; // this object is the empty shape scaffold list that is later added upon. 

var shapeStart = [0,10,0]; // this list defines the coordinates where the shape is drawn when it first appears at the top of the screen. 

var transformList = [2,1,1,1,1,1,2]; // this list defines the centre point of the shapes for use in rotation. 

var grid; // these 6 objects are the Grid, Rotation, and Shape classes used to run the game. 
var grid2;
var rotation;
var rotation2;
var shape;
var shape2;

var score;

var define; // this defines whether the "Next Shape" panel is able to be drawn. 

 var gameSpeed = 3000; // these variables control the frequency that the program executes the code; eg, the game's speed. 
var programSpeed = 150;
var actTimerSpeed = Math.floor(gameSpeed/programSpeed)
var timerSpeed = JSON.parse(JSON.stringify(actTimerSpeed));
var timer;

var rotateConstant = 11; // this variable defines the angle that is added or subtracted when the screen is rotated. 
var rotateLogic;

document.addEventListener("keydown", keyDownHandler, false); // this code adds the function that listens for the user's keyboard input. 
document.addEventListener("keyup", keyUpHandler, false);

loadGame();
var i= setInterval(loop,programSpeed); // finally, this single line of code actually starts the program by calling the primary loop function. 