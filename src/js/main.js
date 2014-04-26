require(
	[
		"level/world.js", 
		"level/player.js",
		"gameobject.js",
		"level/cameracontroller.js"
	], main);

function main()
{
    StateManager.addState({
    	world: null,
    	player: null,

		name: "level",

		initialise: function() {
			this.world = new World();
			this.player = new Player(0,this.world);
		},
		update: function(data) {
			this.player.update(data);
		},
		destroy: function() {

		}
	});

	StateManager.switchState("level");
}