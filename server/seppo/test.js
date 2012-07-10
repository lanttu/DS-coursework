function makeGame(){
	var table=document.getElementById("myTable");
	var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var row;
	var cell;
	var i = 0;
	var j = 0;
	var x = 0;
	var y = 0;
	var text = "";
	if((gameOn == 0)&&(numOfPlayers > 1)){
		var val = document.getElementById("size");
		var lev = document.getElementById("level");
		if(lev.value == 1){
			size = Math.round(val.value/6)*6;
			var level = 6;
		}
		else if(lev.value == 2){
			size = Math.round(val.value/4)*4;
			var level = 4;
		}
		else{
			size = Math.round(val.value/2)*2;
			var level = 2;
		}
		game = new Array(size);
		tilanne = new Array(size);
		numOfPairs = size*size/2;
		document.getElementById("pairs").innerHTML = "Number of pairs left: "+numOfPairs;;
		var gameArray = new Array(size*size/2);
		for(i = 0; i<size*size/level;i++){
			gameArray[i] = letters.charAt(Math.round(Math.random()*size))+Math.round(Math.random()*size);
		}
		for(i = 0; i<size; i++){
			tilanne[i] = new Array(size);
			for(j = 0; j<size; j++){
				tilanne[i][j] = "XX";
			}
		}

		for(i = 0; i<size; i++){
			game[i] = new Array(size);
			for(j = 0; j<size; j++){
				game[i][j] = "XX";
			}
		}	

		for(i=0;i<size*size/level;i++){
			for(j = 0; j<level; j++){
				do{
					x = Math.round(Math.random()*(size-1));
					y = Math.round(Math.random()*(size-1));
				}
				while(game[y][x] != "XX");
				game[y][x] = gameArray[i];
			}
		}
		delete gameArray;
		for(i = 0; i<size; i++){
			row = table.insertRow(i);
			for(j = 0; j<size; j++){
				cell = row.insertCell(j);
				cell.innerHTML="XX";
				cell.setAttribute('onclick', 'uiMakeMove('+j+','+i+')');
			}
		}
		gameOn=1;
		document.getElementById("turn").innerHTML = "Player in turn "+playersList[playerInTurn][0]+" score: "+playersList[playerInTurn][1]+"!";
	}
}

function endTurn(){
	displayResult(scardX, scardY);
	displayResult(cardX, cardY);
	timer_on = 0;
	playerInTurn++;
	if(playerInTurn == numOfPlayers){
		playerInTurn = 0;
	}
	document.getElementById("turn").innerHTML = "Player in turn "+playersList[playerInTurn][0]+" score: "+playersList[playerInTurn][1]+"!";
}

function resetBoard(){
	delete playersList;
	numOfPlayers = 0;
	playerInTurn = 0;
	delete game;
	delete tilanne;
	gameOn = 0;
	var Parent = document.getElementById("myTable");
	while(Parent.hasChildNodes())
	{	
		Parent.removeChild(Parent.firstChild);
	}
	var Parent = document.getElementById("pTable");
	while(Parent.hasChildNodes())
	{	
		Parent.removeChild(Parent.firstChild);
	}
	
}

function endGame(){
	var i = 0;
	var winner = 0;	
	for(i = 1; i < numOfPlayers; i++){
		if(playersList[winner][1] < playersList[i][1]){
			winner = i;
		}
	}
	document.getElementById("turn").innerHTML = "Game Over! Winner is "+playersList[winner][0]+" score: "+playersList[winner][1]+"!";

	setTimeout("resetBoard();", 1000);
}

function uiMakeMove(x, y){
	var i = 0;
	if((tilanne[y][x] == "XX")&&(timer_on == 0)){	
		if(card == "XX"){
			card = game[y][x];
			cardX = x;
			cardY = y;
			displayResult(x, y);
			tilanne[y][x] = game[y][x];
		}
		else{
			if(card == game[y][x]){
				tilanne[y][x] = game[y][x];
				displayResult(x, y);
				numOfPairs = numOfPairs - 1;
				playersList[playerInTurn][1]++;
				document.getElementById("pairs").innerHTML = "Number of pairs left: "+numOfPairs;
				document.getElementById("turn").innerHTML = "Player in turn "+playersList[playerInTurn][0]+" score: "+playersList[playerInTurn][1]+"!";
				if(numOfPairs == 0){
					endGame();
				}
			}
			else{
				displayResult(x, y);
				scardX = x;
				scardY = y;
				var t2=setTimeout("endTurn();",timeShown);
				timer_on = 1;
				tilanne[y][x] = "XX";
				tilanne[cardY][cardX] = "XX";	
			}
			card = "XX";
		}
	}
}


function displayResult(x, y)
{
	var row=document.getElementById("myTable").rows;
	var cell = row[y].cells;
	if(cell[x].innerHTML=="XX"){
		cell[x].innerHTML=game[y][x];
	}
	else{
		cell[x].innerHTML="XX";
	}
}

function addPlayer(){
	if(gameOn == 0){
		var row;
		numOfPlayers += 1;
		var text = "Player"+numOfPlayers;
		var newPlayer = new Array(2);
		newPlayer[0] = text;
		newPlayer[1] = 0;
		playersList.push(newPlayer);
		var Parent = document.getElementById("pTable");
		if(!(Parent.hasChildNodes())){
			var tmp = Parent.insertRow(0);
			tmp.insertCell(0);
			alert("Hello! I am an alert box!");
		}
		row = Parent.rows;
		
		if(numOfPlayers == 1){
			var cell = row[0].cells;
			cell[0].innerHTML = text;
			
		}
		else{
			var cell=row[0].insertCell(numOfPlayers);
			cell.innerHTML = text;	
		}	
	}
}


