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

	this.scale.x = 0.25;
	this.scale.y = -0.25;
	this.move = Math.floor(Math.random()*7);
	this.timer = 0;
<<<<<<< HEAD
	this.maxDistance = 180;
=======
	this.newTimer = 100 + Math.random()*200;
	this.maxDistance = 100;
>>>>>>> ea1d6cd97802cda57e2bc39fea84eae3783a87ae
	

	this.velocity = this.jumpHeight;
	this.radius--;

	this.animations.play("walk");

	this.findNearestMiner = function()
	{
		var lowestDistance = undefined;
		var lowestMiner = undefined;

		for(var i = 0; i < StateManager.getState().miners.length; ++i)
		{
			var miner = StateManager.getState().miners[i];

			var dx = miner.position.x - this.position.x;
			var dy = miner.position.y - this.position.y;

			var dist = Math.sqrt(dx*dx + dy*dy);

			if(lowestDistance == undefined)
			{
				lowestDistance = dist;
				lowestMiner = miner;
			}
			else
			{
				if(dist < lowestDistance)
				{
					lowestDistance = dist;
					lowestMiner = miner;
				}
			}
		}
		return {miner: lowestMiner, distance: lowestDistance};
	}

	this.update = function(data)
	{
		this.animations.update(data);

		if(this.angle > 360)
		{
			this.angle = 1;
		}

		if(this.angle < 0)
		{
			this.angle = 359;
		}

		this.health.updateHealthbar(data);
		

		var target = this.findNearestMiner();

		if(target.miner)
		{
			if(target.distance > 6)
			{
				if (this.angle - 180 < target.miner.angle - 180)
				{
					this.speed = 6*data.dt;
				}

				if (this.angle - 180 > target.miner.angle - 180)
				{
					this.speed = -6*data.dt;
				}
			}
			else
			{
				this.speed = 0;
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