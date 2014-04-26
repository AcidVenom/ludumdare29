require(
	[
		"player.js", 
		"animationmanager.js",
		"gameobject.js"
	], main);

function main()
{
    StateManager.addState({
		name: "menu",

		initialise: function() {
		},
		update: function(data) {
		},
		destroy: function() {

		}
	});

	StateManager.switchState("menu");
}