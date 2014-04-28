var StabilityBar = function(val)
{
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/ui/sprGui.png']);
	extend(this,sprite);
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.pivot.x = 0.5;
	this.pivot.y = 0.5;
	this.__z = 9998;

	sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/ui/sprStabilityBar.png']);
	sprite.position.x -= 68;
	sprite.position.y -= 35;
	sprite.__z = 9999;
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

	this.update = function(data)
	{
		this.timer+=1* data.dt*StateManager.getState().world.timeScale*10;
		this.value = StateManager.getState().stability;
		this.bar.scale.x = 138/this.maxValue * this.value;

		this.textGoblins.setText(StateManager.getState().enemies.length);
		this.textMiners.setText(StateManager.getState().miners.length);
		this.textWave.setText(StateManager.getState().world.wave + 1);

		this.rotation = Math.sin(this.timer*0.01)/3;
		if(!StateManager.getState().gameOver)
		{
			this.scale.y = 1+Math.abs(Math.sin(this.timer*0.01))/10;
		}
		else
		{
			this.textGoblins.alpha = 0;
			this.textMiners.alpha = 0;
			this.textWave.alpha = 0;
			this.bar.alpha = 0;

			if(Input.isDown("enter"))
			{
				StateManager.getState().stability = StateManager.getState().maxStability;
				StateManager.switchState("level");
			}
		}
		this.scale.x = 1+Math.abs(Math.sin(this.timer*0.01))/10;
		
	}

	this.textGoblins.__z = 2000;
	this.textMiners.__z = 2000;
	this.textWave.__z = 2000;

	this.addChild(this.textGoblins);
	this.addChild(this.textMiners);
	this.addChild(this.textWave);
}

var UI = function(val)
{
	this.bar = new StabilityBar(val);
	this.criticals = [];
	this.timer = 0;
	this.speed = Math.PI/2 + 0.02;
	this.overlay = new PIXI.Graphics();
	this.overlay.__z = 1000000;
	this.deathReason = new PIXI.Text("",{
		font: "bold 36pt Arial",
		fill: "#FFFFFF",
		align: "center"
	});
	this.deathReason.__z = 10000000;
	this.deathReason.alpha = 0;
	this.deathReason.position.x = 640;
	this.deathReason.position.y = 360;
	this.deathReason.anchor.x = 0.5;
	this.deathReason.anchor.y = 0.5;

	Game.PIXI.Stage.addChild(this.overlay);
	Game.PIXI.Stage.addChild(this.deathReason);

	this.addCritical = function(angle)
	{
		var crit = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/ui/sprCritical.png']);
		this.criticals.push(crit);
		crit.position.x = 0;
		crit.position.y = 0;
		crit.anchor.x = 0.5;
		crit.anchor.y = 0.5;
		crit.pivot.x = 0.5;
		crit.pivot.y = 0.5;
		crit.scale.x = 0.5;
		crit.scale.y = 0.5;
		crit.__z = 2000;
		Game.sort();

		Game.PIXI.Camera.addChild(crit);
		
	}

	this.update = function(data)
	{
		if(StateManager.getState().gameOver)
		{
			this.timer += this.speed;
			this.bar.setTexture(PIXI.TextureCache[Utils.Assets.Images + 'level/ui/sprGameOver.png']);
			StateManager.getState().world.timeScale = 0;
			if(this.speed > 0)
			{
				this.speed -= 0.01;
			}
			else
			{
				this.speed = 0;
			}
			this.bar.scale.y = Math.sin(this.timer);

			this.overlay.clear();
			this.overlay.beginFill(0x000000);
			this.overlay.drawRect(0,0,1280,720);
			this.overlay.endFill();
			this.overlay.alpha = 0.8;
			this.deathReason.alpha = 1;
		}
		
		this.bar.update(data);
		for(var i = 0; i < this.criticals.length; ++i)
		{
			var crit = this.criticals[i];

			crit.scale.x += 0.1;
			crit.scale.y += 0.1;
			crit.alpha -= 0.05;
			crit.radius -= 10;

			if(crit.alpha < 0)
			{
				Game.PIXI.Camera.removeChild(crit);
				this.criticals.splice(i,1);
			}
		}
	}

	Game.sort();
}