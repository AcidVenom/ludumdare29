require(
	[
		"animationmanager.js",
		"level/world.js", 
		"level/player.js",
		"level/enemy.js",
		"gameobject.js",
		"level/cameracontroller.js"
	], main);

function main()
{
    StateManager.addState({
    	world: null,
    	player: null,
    	enemies: [],

		name: "level",

		initialise: function() {
			this.world = new World();
			this.player = new Player(0, this.world);

			//for (var i = 0; i < 5; ++i) {
				this.enemy = new Enemy(0, this.world);
			//
		},
		update: function(data) {
			this.player.update(data);
			this.enemy.update(data);
		},
		destroy: function() {

		}
	});

	StateManager.switchState("level");
}