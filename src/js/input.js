document.addEventListener("keydown",function(e){
	Input.__keyPressed[e.keyCode] = true;
	Input.__keyPressed[-1] = true;
})

document.addEventListener("keyup",function(e){
	Input.__keyPressed[e.keyCode] = false;
	Input.__keyPressed[-1] = false;
})

document.getElementById("canvas").addEventListener("mousemove", function(e)
{
	var rect = canvas.getBoundingClientRect();
	Input.__mouse.x = (e.clientX - rect.left) * Game.getScale().x;
	Input.__mouse.y = (e.clientY - rect.top) * Game.getScale().y;
});

document.getElementById("canvas").addEventListener("mousedown", function(e)
{
	Input.__mouse.down = true;
});

document.getElementById("canvas").addEventListener("mouseup", function(e)
{
	Input.__mouse.down = false;
});



var Input = {
	__scale: {x: 1, y: 1},
	__mouse: {x: 0, y: 0, down: false},
	__keyPressed: [],

	__initialise: function(){
		for(var i = 0; i < 255; ++i)
		{
			this.__keyPressed[i] = false;
		}
	},

	setScale: function(scale){
		this.__scale = scale;
	},

	getMouse: function() {
		return this.__mouse;
	},

	isDown: function(key){
		var keyCode;
		
		switch(key){
			case "any":
				keyCode = -1;
			break;

			case "left":
				keyCode = 37;
			break;
			
			case "up":
				keyCode = 38;
			break;
			
			case "right":
				keyCode = 39;
			break;
			
			case "down":
				keyCode = 40;
			break;
			
			case "shift":
				keyCode = 16;
			break;

			case "ctrl":
				keyCode = 17;
			break;
			
			case "alt":
				keyCode = 18;
			break;
			
			case "space":
				keyCode = 32;
			break;
			
			case "enter":
				keyCode = 13;
			break;
			
			case "a":
				keyCode = 65;
			break;
			
			case "b":
				keyCode = 66;
			break;
			
			case "c":
				keyCode = 67;
			break;
			
			case "d":
				keyCode = 68;
			break;
			
			case "e":
				keyCode = 69;
			break;
			
			case "f":
				keyCode = 70;
			break;
			
			case "g":
				keyCode = 71;
			break;
			
			case "h":
				keyCode = 72;
			break;
			
			case "i":
				keyCode = 73;
			break;
			
			case "j":
				keyCode = 74;
			break;
			
			case "k":
				keyCode = 75;
			break;
			
			case "l":
				keyCode = 76;
			break;
			
			case "m":
				keyCode = 77;
			break;
			
			case "n":
				keyCode = 78;
			break;
			
			case "o":
				keyCode = 79;
			break;
			
			case "p":
				keyCode = 80;
			break;
			
			case "q":
				keyCode = 81;
			break;
			
			case "r":
				keyCode = 82;
			break;
			
			case "s":
				keyCode = 83;
			break;
			
			case "t":
				keyCode = 84;
			break;
			
			case "u":
				keyCode = 85;
			break;
			
			case "v":
				keyCode = 86;
			break;
			
			case "w":
				keyCode = 87;
			break;
			
			case "x":
				keyCode = 88;
			break;
			
			case "y":
				keyCode = 89;
			break;
			
			case "z":
				keyCode = 90;
			break;
			
			default:
				throw "No key preset like that";
			break;
		}
		
		if(this.__keyPressed[keyCode]){
			return true;
		}
		else{
			return false
		}
	}
}

Input.__initialise();