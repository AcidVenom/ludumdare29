var StabilityBar = function(val)
{
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/ui/sprGui.png']);
	extend(this,sprite);
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.pivot.x = 0.5;
	this.pivot.y = 0.5;
	this.__z = 1000;

	sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/ui/sprStabilityBar.png']);
	sprite.position.x -= 68;
	sprite.position.y -= 35;
	sprite.__z = 1001;
	this.addChild(sprite);

	Game.PIXI.Camera.addChild(this);

	this.position.y -= 10;

	this.value = val;
	this.maxValue = this.value;

	this.bar = this.children[0];

	this.textGoblins = new PIXI.Text("");
	this.textGoblins.setStyle({
		font: 'bold 14px Arial',
		fill: '#FFFFFF',
		align: 'center'
	});

	this.textGoblins.position.x -= 30;


	this.textMiners = new PIXI.Text("");
	this.textMiners.setStyle({
		font: 'bold 14px Arial',
		fill: '#FFFFFF',
		align: 'center'
	});

	this.textMiners.position.x += 20;
	this.timer = 0;

	this.update = function(data)
	{
		this.timer+=1* data.dt*StateManager.getState().world.timeScale*10;
		this.value = StateManager.getState().stability;
		this.bar.scale.x = 138/this.maxValue * this.value;

		this.textGoblins.setText(StateManager.getState().enemies.length);
		this.textMiners.setText(StateManager.getState().miners.length);

		this.rotation = Math.sin(this.timer*0.01)/3;
		this.scale.x = 1+Math.abs(Math.sin(this.timer*0.01))/10;
		this.scale.y = 1+Math.abs(Math.sin(this.timer*0.01))/10;
	}

	this.textGoblins.__z = 2000;
	this.textMiners.__z = 2000;
	this.addChild(this.textGoblins);
	this.addChild(this.textMiners);
}

var UI = function(val)
{
	this.bar = new StabilityBar(val);

	this.update = function(data)
	{
		this.bar.update(data);
	}
}