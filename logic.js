//declaring our variable
let board;
let score = 0;
let rows = 4;
let column = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;
//variables for touch input
let startX = 0;
let startY = 0;

//create a function to set the gameboard
function setGame(){
	//initialize the 4x4 gameboard with all tiles set to 0
	board = [
		[0,0,0,0],	
		[0,0,0,0],	
		[0,0,0,0],	
		[0,0,0,0]
	]

	//create the game board tile on the html document
	//outer loop is for rows, inner loop is for creating columns
	for(let r=0; r < rows; r++)	
	{
		for(let c=0; c < column; c++)
		{
			//creating a div element representing a tile
			let tile = document.createElement("div"); //creating an html to contain in a tile

			//setting a unique identifier, r0c0 -> 0 - 0
			tile.id = r.toString() + "-" + c.toString();

			// board is currently set to 0
			let num = board[r][c];

			// Updating the tile's appearance based on the num value
			updateTile(tile, num);

			// append the tile to the gameboard container
			document.getElementById("board").append(tile);
		}
	}

	// random tile
	setTwo();
	setTwo();
}

//Function to update the appearance of a tile based on its number
function updateTile(tile,num)
{
	//clear the tile content
	tile.innerText = "";

	//clear the classList to avoid multiple classes
	tile.classList.value = "";

	//add a class named "tile"
	tile.classList.add("tile");

	// This will check for the "num" parameter and will apply specific styling based on the number value.
	// If num is positive, the number is converted to a string and placed inside the tile as text.
	if(num > 0) {
	    // Set the tile's text to the number based on the num value.
	    tile.innerText = num.toString();
	    // if num is less than or equal to 4096, a class based on the number is added to the tile's classlist. 
	    if (num <= 4096){
	        tile.classList.add("x"+num.toString());
	    } else {
	        // if num is greater than 4096, a special  class "x8192" is added.
	        tile.classList.add("x8192");
	    }
	}

}

//event that triggers when webpage finishes loading
window.onload = function(){
	//to execute or invoke the setGame();
	setGame();
}

// create function for event listeners for your sliding (left, right, up, and down)
// e represents an event, which contains information about the action occured
function handleSlide(e){
	//console.log(e.code);

	

	//check if the pressed key is one of the arrow keys
	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){

	//prevent default behavior (scrolling on keydown)
	e.preventDefault()

		//this will invoke/call a function based on the arrow pressed
		if(e.code == "ArrowLeft")
		{
			slideLeft();
			setTwo();
		}
		else if(e.code == "ArrowRight")
		{
			slideRight();
			setTwo();
		}
		else if(e.code == "ArrowUp")
		{
			slideUp();
			setTwo();
		}
		else if(e.code == "ArrowDown")
		{
			slideDown();
			setTwo();
		}
	}
	//udpate score
	document.getElementById("score").innerText = score;

	  checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key to restart");
            // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed

    }
}

//register what key is pressed
document.addEventListener("keydown", handleSlide);

function filterZero(row)
{
	//removing of empty tiles 
	return row.filter(num => num != 0 );
}

//core function for sliding and merging tiles (adjacent same number tiles) in a row 
function slide(row)
{
	//sample: [0,2,2,2]
	row = filterZero(row); //get rid of zero tiles

	//sample: [2,2,2]
	//iterate for checking adjacent equal numbers
	for (let i = 0; i < row.length - 1; i++)
	{
		// yong 2 ba is equal sa 2 next position?
		if (row[i] == row[i+1])
		{
			// double the first element
			row[i] *= 2;
			// setting the second one to 0
			row[i+1] = 0; // [2,2,2] -> [4,0,2]
			//logic for scoring
			score += row[i];
		}
	}
		//[4,2]
		row = filterZero(row);

		//add zeroes back
		//[4,2] ->  [4,2,0,0]
		while(row.length < column)
		{
			row.push(0)
		}

		return row;
}


function slideLeft()
{
	//iterate through each row or check each row for
	for(let r = 0; r < rows; r++)
	{
		let row = board[r];

		let originalRow = row.slice(); //for storing of original row

		//call the slide function to merge similar numbers that is greater than 0
		row = slide(row); //slide row function is to merge numbers with the same value

		//updated value of the board
		board[r] = row; 

		//update the id of the tile as well as the appearance
		for (let c = 0; c < column; c++)
		{
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			//line for animation
			if (originalRow[c] !== num && num !== 0) //for checking if the tile has changes
			{
				tile.style.animation = "slide-from-right 0.3s";

				setTimeout(()=>
				{
					tile.style.animation = "";
				}, 300)
			}
			updateTile(tile, num); //update the tile and it's appearance
		}
	}
}

function slideRight()
{
	//iterate through each row or check each row for
	for(let r = 0; r < rows; r++)
	{
		let row = board[r];

		let originalRow = row.slice();
		//reverse the order of the row, mirrored verskon of slide left
		row.reverse();

		//call the slide function to merge similar numbers that is greater than 0
		row = slide(row); //slide row function is to merge numbers with the same value

		row.reverse();

		//updated value of the board
		board[r] = row; 

		//update the id of the tile as well as the appearance
		for (let c = 0; c < column; c++)
		{
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			if (originalRow[c] !== num && num !== 0) //for checking if the tile has changes
			{
				tile.style.animation = "slide-from-left 0.3s";

				setTimeout(()=>
				{
					tile.style.animation = "";
				}, 300)
			}

			updateTile(tile, num); //update the tile and it's appearance
		}
	}
}

function slideUp()
{
    for(let c = 0; c < column; c++) {
        // In two dimensional array, the first number represents row, and second is column.
        // Create a temporary array called row that represents a column from top to bottom.
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]] // first column of the board =  [2, 0, 2, 0]

        //For animation
        let originalRow = row.slice();

        row = slide(row) // [2, 2] -> [4, 0] -> [4, 0, 0, 0]

        // Check which tiles have changed
        let changedIndices = [];

        for (let r = 0; r < rows; r++)
        {	// This will record the current position of tiles that have changed. 
        	if (originalRow[r] !== row[r])
        	{
        		changedIndices.push(r);
        	}
        }

        // Update the id of the tile
        for(let r = 0; r < rows; r++){
            // sets the values of the board array back to the values of the modified row, essentially updating the column in the game board.
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];


            if(changedIndices.includes(r) && num !== 0)
            {
            	tile.style.animation = "slide-from-bottom 0.3s"
            	setTimeout(() => 
            	{
            		tile.style.animation = "";
            	}, 300)
            }
            updateTile(tile, num)
        }
    }
}

function slideDown()
{
	for(let c = 0; c < column; c++) {
        // In two dimensional array, the first number represents row, and second is column.
        // Create a temporary array called row that represents a column from top to bottom.
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]] // first column of the board =  [2, 0, 2, 0]

        let originalRow = row.slice();

        row.reverse();

        row = slide(row) // [2, 2] -> [4, 0] -> [4, 0, 0, 0]

        row.reverse();

        let changedIndices = [];

        for (let r = 0; r < rows; r++)
        {	// This will record the current position of tiles that have changed. 
        	if (originalRow[r] !== row[r])
        	{
        		changedIndices.push(r);
        	}
        }

        // Update the id of the tile
        for(let r = 0; r < rows; r++){
            // sets the values of the board array back to the values of the modified row, essentially updating the column in the game board.
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if(changedIndices.includes(r) && num !== 0)
            {
            	tile.style.animation = "slide-from-top 0.3s"
            	setTimeout(() => 
            	{
            		tile.style.animation = "";
            	}, 300)
            }
            
            updateTile(tile, num)
        }
    }
}

//will check if there is an empty tile(zero tile)
function hasEmptyTile()
{
	for (let r = 0; r < rows; r++)
	{
		for (let c = 0; c < column; c++)
		{
			//check if the current tile is 0
			if (board[r][c] == 0)
			{
				return true;
			}
		}
	}
	// there is no tile with zero value
	return false;
}

//create a function that will add a new random 2 tile in the gameboard
function setTwo()
{
	if(!hasEmptyTile()) // not 
	{
		return;
	}
	
	//declare a value if zero tile is found
	let found = false;	

	while (!found){
		//math.random is to generate number between 0 to 1 times to the row or columns
		//math.floor rounds down to the nearest integer
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() *column);

		//check if the position r,c in the gameboard is empty
		if (board[r][c] == 0)
		{
			board[r][c] = 2;

			let tile = document.getElementById(r.toString() + "-" + c.toString())
			tile.innerText = "2";
			tile.classList.add("x2");

			//break the look if you find an empty tile
			found = true;
		}
	}
}

function checkWin(){
    // iterate through the board
    for(let r =0; r < rows; r++){
        for(let c = 0; c < column; c++){
            // check if current tile == 2048 and is2048Exist == false
            if(board[r][c] == 2048 && is2048Exist == false){
                alert('You Win! You got the 2048');  // If true, alert and  
                is2048Exist = true;     // reassigned the value of is2048Exist to true to avoid continuous appearance of alert.
            } else if(board[r][c] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true;     // reassigned the value of is4096Exist to true to avoid continuous appearance of alert.
            } else if(board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory!: You have reached 8192! You are incredibly awesome!");
                is8192Exist = true;    // reassigned the value of is8192Exist to true to avoid continuous appearance of alert.
            }
        }
    }
}

function hasLost() {
    // Check if the board is full
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < column; c++) {
            if (board[r][c] === 0) {
                // Found an empty tile, user has not lost
                return false;
            }

            const currentTile = board[r][c];

            // Check adjacent cells (up, down, left, right) for possible merge
            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < column - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
        }
    }

    // No possible moves left or empty tiles, user has lost
    return true;
}

// RestartGame by replacing all values into zero.
function restartGame(){
    // Iterate in the board and 
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < column; c++){
            board[r][c] = 0;    // change all values to 0
        }
    }
    score = 0; //reset score to 0
    setTwo()    // new tile   
}

//mobile compatibility
// we capture the coordinates of the touch input
document.addEventListener("touchstart", (e) =>
{
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;

});

// prevent scrolling if touch input is received.
document.addEventListener('touchmove', (e)=>
{ if(!e.target.className.includes("tile"))
	{
		return
	}
	e.preventDefault(); //disables the line scrolling 
}, {passive: false});

//receiving swipe of the user, listen for the "touchend" event on the entire document or decide which is the direction of swipe
document.addEventListener("touchend", (e) =>
{
	//check if the element triggered the event has a classname tile
	if(!e.target.className.includes("tile"))
	{
		return // exit the function
	}

	//calculate the horizontal and vertical difference between the initial position and final position

	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

	//check if the horizontal magnitude is greater magnitude than vertical swipe

	if(Math.abs(diffX) > Math.abs(diffY))
	{
		//horizontal swipe
		if(diffX>0)
		{
			slideLeft();
			setTwo();
		}
		else
		{
			slideRight();
			setTwo();
		}
	}
	else
	{
		//vertical swipe
		if(diffY > 0)
		{
			slideUp();
			setTwo();
		}
		else
		{
			slideDown();
			setTwo();
		}
	}
		//udpate score
	document.getElementById("score").innerText = score;

	  checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key to restart");
            // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed

    }
})

