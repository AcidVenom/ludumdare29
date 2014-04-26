require(
	[
		"animationmanager.js",
		"level/world.js", 
		"level/player.js",
		"level/enemy.js",
		"level/healthbar.js",
		"gameobject.js",
		"level/cameracontroller.js"
	], main);

function main()
{
    StateManager.addState({
    	world: null,
    	player: null,
    	enemies: [],
    	players: [],

		name: "level",

		initialise: function() {
			this.world = new World();
			for (var i = 0; i < 1; i++) {
				this.players.push(new Player(Math.random() * 360, this.world));
			}

			for (var i = 0; i < 50; ++i) {
				this.enemies.push(new Enemy(Math.random() * 360, this.world));
			}
		},
		update: function(data) {
			for (var i = 0; i < 1; i++) {
				this.players[i].update(data);
			}
			for (var i = 0; i < this.enemies.length; ++i) {
				this.enemies[i].update(data);
			}
		},
		destroy: function() {

		}
	});

	StateManager.switchState("level");
}