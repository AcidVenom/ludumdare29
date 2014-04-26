require(
	[
		"animationmanager.js",
		"level/world.js", 
		"level/player.js",
		"level/enemy.js",
		"level/miner.js",
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
    	miners: [],
    	players: [],
		name: "level",

		initialise: function() {
    		this.hotspotMiners = Math.random() * 90;
    		this.hotspotEnemies = Math.random() * 90 + 180;
			this.world = new World();
			this.player = new Player(Math.random() * 360, this.world);

			for (var i = 0; i < 10; ++i) {
				this.miners.push(new Miner(Math.random() * 360, this.world, this.hotspotMiners))
			}

			for (var i = 0; i < 10; ++i) {
				this.enemies.push(new Enemy(Math.random() * 360, this.world, this.hotspotEnemies));
			}
		},
		update: function(data) {
			this.player.update(data);
			for (var i = 0; i < this.miners.length; ++i) {
				this.miners[i].update(data);
			}

			for (var i = 0; i < this.enemies.length; ++i) {
				this.enemies[i].update(data);
			}
		},
		destroy: function() {
			Game.PIXI.Camera.children = [];
		}
	});

	StateManager.switchState("level");
}