require(
	[
		"animationmanager.js",
		"level/world.js", 
		"level/player.js",
		"level/enemy.js",
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
    	ui: null,
 

		name: "level",

		initialise: function() {
			this.world = new World();
			this.player = new Player(Math.random() * 360, this.world);
			this.ui = new UI(this.stability);
			for (var i = 0; i < 10; ++i) {
				this.enemies.push(new Enemy(Math.random() * 360, this.world));
			}
		},
		update: function(data) {
			this.player.update(data);
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