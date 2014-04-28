var Overlay = function () {
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprRedGlow.png']);

	sprite.__z = 999;
	var time = 0,
		sin = 0,
		speed = 10,
		angle = 0;
	sprite.position.x = 0;
	sprite.position.y = 0;
	sprite.pivot.x = 0.5;
	sprite.pivot.y = 0.5;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;

	this.update = function (data) {
		var remainder = (StateManager.getState().maxStability - StateManager.getState().stability) / StateManager.getState().maxStability,
			percentage = StateManager.getState().stability / StateManager.getState().maxStability;
		
		time += 0.5;

		if (remainder >= 0.7) {
			sprite.alpha = Math.abs(Math.sin(time / 8)) - 0.3;
		} else {
			sprite.alpha = remainder;
		}
	};

	Game.PIXI.Camera.addChild(sprite);
}