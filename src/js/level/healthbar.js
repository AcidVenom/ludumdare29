var Healthbar = function (entity) {
	var rtn = {
		__maxHealth: 10,
		__health: 5,
		__graphics: new PIXI.Graphics(),
		damage: function () {
			this.__health--;
		},
		updateHealthbar: function (data) {
			this.__graphics.clear();
			this.__graphics.beginFill(0x000000);
			this.__graphics.drawRect(-2, -87, 94, 20);
			this.__graphics.endFill();
			this.__graphics.beginFill(0xFF0000);
			this.__graphics.drawRect(0, -85, 90, 16);
			this.__graphics.endFill();
			this.__graphics.beginFill(0x00FF00);
			this.__graphics.drawRect(0, -85, (this.__health / this.__maxHealth) * 90, 16);
			this.__graphics.endFill();
		}
	};

	entity.addChild(rtn.__graphics);

	return rtn;
};