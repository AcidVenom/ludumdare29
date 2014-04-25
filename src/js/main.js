require(["player.js", "animationmanager.js"], main);

function main()
{
    StateManager.addState({
		name: "menu",

		initialise: function() {
			this.mountain = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'mountain.jpg']);
			Game.PIXI.Stage.addChild(this.mountain);
			this.player = new Player();
		},
		update: function(data) {
			this.player.update(data);
		},
		destroy: function() {

		}
	});

	StateManager.switchState("menu");
}