var Miner = function (angle, world, hotspot) {
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprMinerWalk.png']);

	this.animations = {};

	extend(this, sprite);
	extend(this.animations, AnimationManager());
	extend(this, GameObject());

	this.setZ(200);
	this.health = new Healthbar(this);

	this.hotspot = hotspot || 0;
	this.collisionPoint = 260;
	this.world = world;
	this.angle = angle || 0;
	this.radius = this.collisionPoint;
	this.velocity = 0;
	this.position.x = 0;
	this.position.y = 0;

	this.anchor.x = 0.5;
	this.anchor.y = 0.5;

	this.pivot.x = 0.5;
	this.pivot.y = 0.5;

	this.speed = 0;
	this.maxSpeed = 7;

	this.jumpHeight = -10;
	this.dead = false;
	this.timer = 0;
	this.alpha = 0;

	var frames = [];

	for(var i = 0; i < 8; i++)
	{
		frames.push({
			x: i*296,
            y: 0,
            width: 296,
            height: 255
		});
	}

	this.animations.mainSprite = this;
	this.animations.add("walk",{
        frameRate: 0.1,
        frames: frames,
        loop: true,
        reversed: false
	});
	this.animations.play('walk');


	this.setTexture(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprMinerMine.png']);

	var frames = [];
	for(var i = 0; i < 8; i++)
	{
		frames.push({
			x: i*268,
            y: 0,
            width: 268,
            height: 320
		});
	}
	this.animations.add("mine",{
        frameRate: 0.1,
        frames: frames,
        loop: true,
        reversed: false
	});

	this.velocity = this.jumpHeight;
	this.radius--;

	this.scale.x = 0.25;
	this.scale.y = -0.25;
	this.targeted = false;
	this.direction = Math.floor(Math.random()*2);

	this.velocity = this.jumpHeight;
	this.radius--;

	this.update = function (data) {
		if (this.health.__health <= 0)
		{
			this.dead = true;
		}

		if (this.alpha < 1)
		{
			this.alpha+=0.05;
		}

		if(!this.dead)
		{
			this.animations.update(data);
			this.health.updateHealthbar(data);

			if(this.angle > 360)
			{
				this.angle = 0;
			}

			if(this.angle < 0)
			{
				this.angle = 360;
			}

			if(this.targeted)
			{
				switch(this.direction)
				{
					case 0:
					this.speed = 14*data.dt;
					break;

					case 1:
					this.speed = -14*data.dt;
					break;
				}
			}
			else
			{
				this.speed = 0;
			}

			if(this.speed == 0)
			{
				this.animations.setAnimation("mine");
				this.animations.setFramerate("mine",0.3);
				this.direction = Math.floor(Math.random()*2);
			}
			else
			{
				this.animations.setAnimation("walk");
				this.animations.setFramerate("mine",0.2);
			}

			if(this.radius < this.collisionPoint)
			{
				this.velocity += 5 * data.dt;
				this.radius += this.velocity;
			}

			if(this.radius > this.collisionPoint)
			{
				this.radius = this.collisionPoint;
			}

			if(this.speed > 0)
			{
				this.scale.x = -0.25;
				this.health.__graphics.scale.x = 1;
			}
			if(this.speed < 0)
			{
				this.scale.x = 0.25;
				this.health.__graphics.scale.x = -1;
			}

			var wobble = Math.sin(this.angle*Math.PI/180*50);


			this.position.x = this.world.position.x + Math.cos(this.angle * Math.PI / 180) * this.radius;
			this.position.y = this.world.position.y + Math.sin(this.angle * Math.PI / 180) * (this.radius + wobble*4);

			this.rotation = this.angle*Math.PI/180+Math.PI/2;

			this.angle+=this.speed*data.dt;

			if(this.timer > 0)
			{
				this.timer--;
			}
			if(this.timer == 0)
			{
				this.tint = 0xFFFFFF;
			}
		}
		else
		{
			StateManager.getState().miners.splice(StateManager.getState().miners.indexOf(this),1);
			Game.PIXI.Camera.removeChild(this);
		}
	};

	Game.PIXI.Camera.addChild(this);
};