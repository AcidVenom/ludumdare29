var Enemy = function (angle, world) {
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprCharacterWalk.png']);

	this.animations = {};

	extend(this, sprite);
	extend(this.animations, AnimationManager());

	this.collisionPoint = 255;
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
	this.maxSpeed = 8;

	this.jumpHeight = 10;

	var frames = [];

	for(var i = 0; i < 16; i++)
	{
		frames.push({
			x: i*194,
            y: 0,
            width: 194,
            height: 170
		});
	}

	this.animations.mainSprite = this;
	this.animations.add("walk",{
        frameRate: 0.1,
        frames: frames,
        loop: true,
        reversed: false
	});

	this.scale.x = 0.5;
	this.scale.y = -0.5;

	this.animations.play("walk");

	this.update = function(data)
	{
		this.animations.update(data);
		if(Input.isDown("a"))
		{
			if(this.speed > 0)
			{
				//this.speed = 0;
			}
			if (this.speed > -this.maxSpeed)
			{
				//this.speed-=0.5;
			}
		}
		else if(Input.isDown("a"))
		{
			if(this.speed < 0)
			{
				//this.speed = 0;
			}
			if (this.speed < this.maxSpeed)
			{
				//this.speed+=0.5;
			}
		}
		else
		{
			if(this.speed > 0)
			{
				//this.speed-=0.5;
			}
			else if(this.speed < 0)
			{
				//this.speed+=0.5;
			}
		}

		this.animations.setFramerate("walk",this.maxSpeed/20-Math.abs(this.speed)/20);

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

		if (this.radius == this.collisionPoint && Input.isDown('y'))
		{
			this.velocity = this.jumpHeight;
			this.radius--;
		}

		if(this.speed > 0)
		{
			this.scale.x = -0.5;
		}
		else if(this.speed < 0)
		{
			this.scale.x = 0.5;
		}

		this.position.x = this.world.position.x + Math.cos(this.angle * Math.PI / 180) * this.radius;
		this.position.y = this.world.position.y + Math.sin(this.angle * Math.PI / 180) * this.radius;

		this.rotation = this.angle*Math.PI/180+Math.PI/2;

		this.angle+=this.speed*data.dt;
	}

	Game.PIXI.Camera.addChild(this);
};