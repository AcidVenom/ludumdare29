/*
 * @name Utils
 * @description Utilities for your games. Mainly constants
 * and references to objects
 * @author Riko Ophorst
 */
var Utils = {
	Assets: {
		Images: './assets/images/',
		JSON: './assets/json/',
		Audio: './assets/audio/'
	},
	zLayers: {
		GUI: 1000
	},
	Types: {
		Screen: 'screen'
	},
	Text: {
		Small: {
			font: 'bold 10pt Arial',
			fill: "#000000",
			align: 'left'
		},
		Normal: {
			font: 'bold 20pt Arial',
			fill: "#000000",
			align: 'left'
		},
		Big: {
			font: 'bold 30pt Arial',
			fill: "#000000",
			align: 'left'
		},
		Title: {
			font: 'italic 20pt Arial',
			fill: "#000000",
			align: 'left'
		}
	}
};

Math.Slerp = function(x1,y1,x2,y2,speed)
{
	var delta = {x: x2-x1,y: y2-y1}
	var distance = Math.sqrt(delta.x*delta.x + delta.y*delta.y);
	var movement = {x: 0, y: 0}

	if(distance > speed)
	{
		var ratio = speed/distance;
		movement.x = ratio * delta.x;
		movement.y = ratio * delta.y;
	}
	else
	{
		return null;
	}

	return movement;
}