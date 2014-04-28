var Enemy = function (angle, world) {
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprGoblinWalk.png']);

	this.animations = {};

	extend(this, sprite);
	extend(this.animations, AnimationManager());
	extend(this, GameObject());

	this.setZ(100);
	this.health = new Healthbar(this);

	this.collisionPoint = 265;
	this.world = world;
	this.angle = angle;
	this.radius = this.collisionPoint;
	this.velocity = 0;
	this.position.x = 0;
	this.position.y = 0;

	this.anchor.x = 0.5;
	this.anchor.y = 0.5;

	this.pivot.x = 0.5;
	this.pivot.y = 0.5;

	this.speed = 0;
	this.maxSpeed = 2;

	this.jumpHeight = -10;
	this.dead = false;

	var frames = [];

	for(var i = 0; i < 7; i++)
	{
		frames.push({
			x: i*283,
            y: 0,
            width: 283,
            height: 290
		});
	}

	this.animations.mainSprite = this;
	this.animations.add("walk",{
        frameRate: 1,
        frames: frames,
        loop: true,
        reversed: false
	});

	this.scale.x = 0.25;
	this.scale.y = -0.25;
	this.move = Math.floor(Math.random()*7);
	this.timer = 0;

	this.velocity = this.jumpHeight;
	this.radius--;

	this.animations.play("walk");
	this.target = undefined;
	this.alpha = 0;

	this.findNearestMiner = function()
	{
		var lowestDistance = undefined;
		var lowestMiner = undefined;

		for(var i = 0; i < StateManager.getState().miners.length; ++i)
		{

			var dx = StateManager.getState().miners[i].position.x - this.position.x;
			var dy = StateManager.getState().miners[i].position.y - this.position.y;

			var dist = Math.sqrt(dx*dx + dy*dy);

			if(lowestDistance == undefined)
			{
				lowestDistance = dist;
				lowestMiner = StateManager.getState().miners[i];
			}
			else
			{
				if(dist < lowestDistance)
				{
					lowestDistance = dist;
					lowestMiner = StateManager.getState().miners[i];
				}
			}
		}

		if(lowestDistance <= 300 && Math.floor(Math.random()*101) < 20 )
		{
			return {miner: lowestMiner, distance: lowestDistance};
		}
	}

	this.update = function(data)
	{
		this.animations.update(data);
		if(!this.dead)
		{
			if(this.alpha < 1)
			{
				this.alpha+=0.05;
			}
			this.timer++;
		
			if(this.angle > 360)
			{
				this.angle = 1;
			}

			if(this.angle < 0)
			{
				this.angle = 359;
			}

			if (this.health.__health < 1)
			{
				this.timer = 0;
				this.dead = true;
			}
			this.tint = 0xFFFFFF;

			for (var i = 0; i < StateManager.getState().world.impactAreas.length; ++i)
			{
				var impact = StateManager.getState().world.impactAreas[i];

				var dx = impact.x - this.position.x;
				var dy = impact.y - this.position.y;

				var dist = Math.sqrt(dx*dx + dy*dy);

				if(dist < impact.range)
				{
					if (dist*1.5 < impact.range)
					{	
						if(StateManager.getState().ui.criticals.length < 10)
						{
							StateManager.getState().ui.addCritical(this.angle);
						}
					}
					this.velocity = -8*impact.range/dist/2;
					this.radius--;
					this.tint = 0xFF0000;
					if(this.health.__health - impact.damage*(1-dist/impact.range) > 0)
					{
						this.health.__health-=impact.damage*(1-dist/impact.range);
					}
					else{
						this.health.__health = 0;
					}
				}
			}

			this.health.updateHealthbar(data);

			if(!this.target)
			{
				this.target = this.findNearestMiner();
			}

			if(this.target && this.target.miner)
			{
				var dx = this.target.miner.position.x - this.position.x;
				var dy = this.target.miner.position.y - this.position.y;

				this.target.distance = Math.sqrt(dx*dx + dy*dy);
				if(this.target.distance > 12)
				{
					this.target.miner.targeted = true;
					if (this.angle - 180 < this.target.miner.angle - 180)
					{
						this.speed = 10*data.dt*StateManager.getState().world.timeScale;
					}

					if (this.angle - 180 > this.target.miner.angle - 180)
					{
						this.speed = -10*data.dt*StateManager.getState().world.timeScale;
					}
				}
				else
				{
					this.speed = 0;
					if (this.target.miner.health.__health > 0)
					{
						if(this.target.miner.radius == this.target.miner.collisionPoint)
						{
							this.target.miner.health.__health-=5;
							this.target.miner.radius--;
							this.target.miner.velocity = -8
							this.target.miner.tint = 0xFF0000;
							this.target.miner.timer = 3;
						}
					}
				}

				if(this.target.distance > 300 || Math.floor(Math.random()*101) < 2)
				{
					this.target.miner.targeted = false;
					this.target = undefined;
					this.speed = this.speed*-1;
				}
			}
			else
			{
				if(this.timer >= 1000)
				{
					this.move = Math.floor(Math.random()*3);
					switch(this.move)
					{
						case 0:
						this.speed = -2.5;
						break;

						case 1:
						this.speed = 2.5;
						break;

						default:
						this.speed = 0;
						break;
					}

					this.timer = 0;
				}
			}

			if(this.speed == 0)
			{
				this.animations.pause("walk");
			}
			else
			{
				this.animations.resume("walk");
			}

			if(this.radius < this.collisionPoint)
			{
				this.velocity += 5 * data.dt*StateManager.getState().world.timeScale;
				this.radius += 5*this.velocity * data.dt*StateManager.getState().world.timeScale;
			}

			if(this.radius > this.collisionPoint)
			{
				this.radius = this.collisionPoint;
			}

			if(this.speed > 0)
			{
				this.scale.x = -0.25;
				this.health.__graphics.scale.x = -1;
			}
			else if(this.speed < 0)
			{
				this.scale.x = 0.25;
				this.health.__graphics.scale.x = 1;
			}

			var wobble = Math.sin(this.angle*Math.PI/180*50);

			this.position.x = this.world.position.x + Math.cos(this.angle * Math.PI / 180) * this.radius;
			this.position.y = this.world.position.y + Math.sin(this.angle * Math.PI / 180) * (this.radius + wobble*4);

			this.rotation = this.angle*Math.PI/180+Math.PI/2;

			this.angle+=this.speed*data.dt*StateManager.getState().world.timeScale;

		}
		else
		{
			if(this.timer == 0)
			{
				this.tweenAlpha = {a: 1}
				TweenLite.to(
					this.position,
					0.3,
	        		{
	        			x: 0,
	        			y: 0,
	        			ease: Quad.easeIn
	        		}
				);

				TweenLite.to(
					this.tweenAlpha,
					0.3,
	        		{
	        			a: 0,
	        			ease: Quad.easeIn
	        		}
				);
			}
			this.timer = 1;
			this.alpha = this.tweenAlpha.a;

			if(this.alpha == 0)
			{
				if(this.target)
				{
					this.target.miner.targeted = false;
					this.target = undefined;
				}
				StateManager.getState().enemies.splice(StateManager.getState().enemies.indexOf(this),1);
				Game.PIXI.Camera.removeChild(this);
			}
		}
	}

	Game.PIXI.Camera.addChild(this);
};