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
		"level/ui.js",
		"level/particlesystem.js"
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
    	ui: null,
		name: "level",

		initialise: function() {
			this.player = null;
			this.world = null;
			this.enemies = [];
			this.miners = [];
			this.ui = null;
    		this.hotspotMiners = Math.random() * 90;
    		this.hotspotEnemies = Math.random() * 90 + 180;
			this.world = new World();
			this.player = new Player(Math.random() * 360, this.world);
			this.ui = new UI(this.stability);
<<<<<<< HEAD
=======

			for (var i = 0; i < 10; ++i) {
				this.miners.push(new Miner(Math.random() * 360, this.world, this.hotspotMiners));
			}

			for (var i = 0; i < 10; ++i) {
				this.enemies.push(new Enemy(Math.random() * 360, this.world, this.hotspotEnemies));
			}

			Game.PIXI.Camera.addChild(this.world.clouds);
>>>>>>> 5a5bfcd77a8cdca5545e45f16c8d748a0d588bfa
		},
		update: function(data) {
			this.player.update(data);

			if (Input.isDown('b')) {
				this.myPartEmitter.position.x -= 1;
			}

			for (var i = 0; i < this.miners.length; ++i) {
				this.miners[i].update(data);
			}

			for (var i = 0; i < this.enemies.length; ++i) {
				this.enemies[i].update(data);
			}
			this.ui.update();
			this.world.update();
		},
		destroy: function() {
			Game.PIXI.Camera.children = [];
		}
	});

	StateManager.switchState("level");
}