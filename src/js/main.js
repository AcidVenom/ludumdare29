require(
	[
		"animationmanager.js",
		"level/world.js", 
		"level/player.js",
		"level/enemy.js",
		"level/miner.js",
		"level/healthbar.js",
		"gameobject.js",
		"level/cameracontroller.js",
		"level/ui.js"
	], main);

function main()
{
    StateManager.addState({
    	stability: 100,
    	maxStability: 100,
    	world: null,
    	player: null,
    	enemies: [],
    	miners: [],
    	players: [],
    	ui: null,
		name: "level",

		initialise: function() {
    		this.hotspotMiners = Math.random() * 90;
    		this.hotspotEnemies = Math.random() * 90 + 180;
			this.world = new World();
			this.player = new Player(Math.random() * 360, this.world);
			this.ui = new UI(this.stability);
			for (var i = 0; i < 1; ++i) {
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
			this.ui.update();
		},
		destroy: function() {
			Game.PIXI.Camera.children = [];
		}
	});

	StateManager.switchState("level");
}