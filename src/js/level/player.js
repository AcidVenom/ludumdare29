var Player = function(angle, world)
{
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprCharacter.png']);

	extend(this,sprite);

	this.collisionPoint = 330;
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

	this.jumpHeight = -10;

	this.update = function(data)
	{

		if(Input.isDown("left"))
		{
			if(this.speed > 0)
			{
				this.speed = 0;
			}
			if (this.speed > -this.maxSpeed)
			{
				this.speed-=0.5;
			}
		}
		else if(Input.isDown("right"))
		{
			if(this.speed < 0)
			{
				this.speed = 0;
			}
			if (this.speed < this.maxSpeed)
			{
				this.speed+=0.5;
			}
		}
		else
		{
			if(this.speed > 0)
			{
				this.speed-=0.5;
			}
			else if(this.speed < 0)
			{
				this.speed+=0.5;
			}
		}

		if(this.radius > this.collisionPoint)
		{
			this.velocity += 5 * data.dt;
			this.radius-=this.velocity;
		}

		if(this.radius < this.collisionPoint)
		{
			this.radius = this.collisionPoint;
		}

		if (this.radius == this.collisionPoint && Input.isDown("space"))
		{
			this.velocity = this.jumpHeight;
			this.radius++;
		}

		if(this.speed > 0)
		{
			this.scale.x = 1;
		}
		else if(this.speed < 0)
		{
			this.scale.x = -1;
		}

		this.position.x = this.world.position.x + Math.cos(this.angle * Math.PI / 180) * this.radius;
		this.position.y = this.world.position.y + Math.sin(this.angle * Math.PI / 180) * this.radius;

		this.rotation = this.angle*Math.PI/180+Math.PI/2;

		this.angle+=this.speed*data.dt;

	}

	Game.PIXI.Camera.addChild(this);
}