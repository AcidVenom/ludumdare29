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
	
	this.textWave = new PIXI.Text("");
	this.textWave.setStyle({
		font: 'bold 14px Arial',
		fill: '#FFFFFF',
		align: 'center'
	});

	this.textWave.position.y += 60;
	this.textWave.position.x -= 5;
	this.timer = 0;

	this.update = function()
	{
		this.timer++;
		this.value = StateManager.getState().stability;
		this.bar.scale.x = 138/this.maxValue * this.value;

		this.textGoblins.setText(StateManager.getState().enemies.length);
		this.textMiners.setText(StateManager.getState().miners.length);
		this.textWave.setText(StateManager.getState().world.wave + 1);

		this.rotation = Math.sin(this.timer*0.01)/4;
		this.scale.x = 1+Math.abs(Math.sin(this.timer*0.01))/16;
		this.scale.y = 1+Math.abs(Math.sin(this.timer*0.01))/16;
	}

	this.textGoblins.__z = 2000;
	this.textMiners.__z = 2000;
	this.addChild(this.textGoblins);
	this.addChild(this.textMiners);
	this.addChild(this.textWave);
}

var UI = function(val)
{
	this.bar = new StabilityBar(val);

	this.update = function()
	{
		this.bar.update();
	}
}