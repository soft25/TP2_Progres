var express = require('express'); 
var app = express(); 
app.use(express.static('public')); 

var server = require('http').Server(app); 
var io = require('socket.io')(server); 

var clientsID = 0;

var brushPositions = {};

io.on('connection', function (socket) { 
  console.log("serveur> Client "+clientsID+" s'est connecte");
  var clientId = clientsID;
  socket.emit('hello', {  id: clientsID});
  clientsID++; 

  socket.on('mousemove', function (data) { 
	  //console.log("serveur> "+socket.id+" "+socket.x+" "+socket.y);
	  var ind = searchMap(data.x, data.y, data.taille, data.map);
	  console.log(ind);
	  if(!ind)
		  brushPositions[data.id] = {x: data.x, y: data.y, width: 32, height: 32}
	  //console.log("serveur> brushPositions["+socket.id+"] = "+brushPositions[socket.id].x+" "+brushPositions[socket.id].y);
	  io.emit('updatePosition', {brushPositions: brushPositions});

function searchMap(x, y, taille, map){
	for(var i = 0; i < taille; i++){
		//console.log(x+" "+map[i].x+" "+y+" "+map[i].y);
		if((x == map[i].x && y+32 >= map[i].y) || (x == map[i].x && y-32 <= map[i].y) || (x+32 >= map[i].x && y == map[i].y) || (x-32 <= map[i].x && y == map[i].y)){
			//console.log(x+" "+map[i].x+" "+y+" "+map[i].y);
			return true;
		}
	}
	return false;
}

  }); 

  socket.on('keyupdown', function (data) { 
	  //console.log(data.id+" "+data.keycode+" "+data.x+" "+data.y);
	  var ind = searchMap(data.x, data.y, data.taille, data.map);
	  console.log(ind);
	  if(!ind){
		if(data.keycode == 37)
		  brushPositions[data.id] = {x: data.x-10, y: data.y, width: 32, height: 32}
	  	else if(data.keycode == 38)
		  brushPositions[data.id] = {x: data.x, y: data.y-10, width: 32, height: 32}
	  	else if(data.keycode == 39)
		  brushPositions[data.id] = {x: data.x+10, y: data.y, width: 32, height: 32}
	  	else if(data.keycode == 40)
		  brushPositions[data.id] = {x: data.x, y: data.y+10, width: 32, height: 32}
	  }
	 
	  io.emit('updatePosition', {brushPositions: brushPositions});

function searchMap(x, y, taille, map){
	for(var i = 0; i < taille; i++){
		//console.log(x+" "+map[i].x+" "+y+" "+map[i].y);
		if((x == map[i].x && y+32 >= map[i].y) || (x == map[i].x && y-32 <= map[i].y) || (x+32 >= map[i].x && y == map[i].y) || (x-32 <= map[i].x && y == map[i].y)){
			//console.log(x+" "+map[i].x+" "+y+" "+map[i].y);
			return true;
		}
	}
	return false;
}

  }); 

}); 

server.listen(3000, function() { 
 console.log('Example app listening on port 3000!'); 
}); 
