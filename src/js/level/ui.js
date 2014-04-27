var StabilityBar = function(val)
{
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/ui/sprStabilityMeter.png']);
	extend(this,sprite);

	this.position.x = 0;
	this.position.y = 0;
	this.__z = 1000;

	sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/ui/sprStabilityBar.png']);
	sprite.position.x = 30;
	sprite.position.y = 13;
	sprite.__z = 1001;
	this.addChild(sprite);

	Game.PIXI.Camera.addChild(this);

	this.position.x -= 60;
	this.position.y -= 60;

	this.value = val;
	this.maxValue = this.value;

	this.bar = this.children[0];

	this.update = function()
	{
		this.value = StateManager.getState().stability;
		this.bar.scale.x = 93/this.maxValue * this.value;
	}
}

var UI = function(val)
{
	this.bar = new StabilityBar(val);

	this.update = function()
	{
		this.bar.update();
	}
}