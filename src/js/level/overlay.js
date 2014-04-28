var Overlay = function () {
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprRedGlow.png']);

	sprite.__z = 55302000000;
	var time = 0,
		sin = 0;
	sprite.position.x = 0;
	sprite.position.y = 0;
	sprite.pivot.x = 0.5;
	sprite.pivot.y = 0.5;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;

	this.update = function (data) {
		var remainder = (StateManager.getState().maxStability - StateManager.getState().stability) / StateManager.getState().maxStability,
			percentage = StateManager.getState().stability / StateManager.getState().maxStability;
		
		time++;
		if (remainder <= 0.95) {
			sin = Math.abs(Math.sin(time / (10 * percentage)));
		} else if (sin !== 1) {
			sin = 1;
		}
		sprite.alpha = sin;
	};

	Game.PIXI.Camera.addChild(sprite);
}