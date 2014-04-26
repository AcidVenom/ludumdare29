var Healthbar = function (entity) {
	this.__maxHealth = 10;
	this.__health = 5;
	this.__graphics = new PIXI.Graphics();
	this.damage = function () {
		this.__health--;
	}
	this.updateHealthbar = function (data) {
		this.__graphics.clear();
		this.__graphics.beginFill(0x000000);
		this.__graphics.drawRect(-64, -147, 94, 20);
		this.__graphics.endFill();
		this.__graphics.beginFill(0xFF0000);
		this.__graphics.drawRect(-62, -145, 90, 16);
		this.__graphics.endFill();
		this.__graphics.beginFill(0x00FF00);
		this.__graphics.drawRect(-62, -145, (this.__health / this.__maxHealth) * 90, 16);
		this.__graphics.endFill();
	}

	entity.addChild(this.__graphics);
};