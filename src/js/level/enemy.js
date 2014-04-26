var Enemy = function (angle, world) {
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprGoblinWalk.png']);

	this.animations = {};

	extend(this, sprite);
	extend(this.animations, AnimationManager());

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

	this.scale.x = 0;
	this.scale.y = 0;
	this.move = Math.floor(Math.random()*7);
	this.timer = 0;
	this.newTimer = 100 + Math.random()*200;

	

	this.velocity = this.jumpHeight;
	this.radius--;

	this.animations.play("walk");

	this.findNearestMiner = function()
	{
		var nearest = undefined;
		var nearestDistance = undefined;

		for(var i = 0; i < StateManager.getState().miners.length-1; ++i)
		{
			var miner = StateManager.getState().miners[i];
			var distance = Math.abs(miner.angle - this.angle);

			if(nearest === undefined)
			{
				nearest = miner;
				nearestDistance = distance;
			}
			else
			{
				if (distance < nearestDistance)
				{
					nearest = miner;
					nearestDistance = distance;
				}
			}
		}

		return nearest;
	}

	this.target = this.findNearestMiner();

	this.update = function(data)
	{
		this.animations.update(data);
		if(this.scale.y > -0.25)
		{
			this.scale.y -= 0.05;
			this.scale.x += 0.05;
		}
	
		this.health.updateHealthbar(data);

		var distance = Math.abs(this.target.angle - this.angle);

		if (this.target.angle < this.angle && distance > 2)
		{
			this.speed = -6*data.dt;
		}
		else
		{
			this.speed = 0;
		}

		if (this.target.angle > this.angle && distance > 2)
		{
			this.speed = 6*data.dt;
		}
		else
		{
			this.speed = 0;
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

		this.angle+=this.speed*data.dt;
	}

	Game.PIXI.Camera.addChild(this);
};