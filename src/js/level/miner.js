var Miner = function (angle, world, hotspot) {
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprMinerWalk.png']);

	this.animations = {};
	this.miner = {};

	extend(this, sprite);
	extend(this.animations, AnimationManager());


	this.health = new Healthbar(this);

	this.hotspot = hotspot || 0;
	this.collisionPoint = 265;
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
	this.maxSpeed = 8;

	this.jumpHeight = -10;

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

	this.velocity = this.jumpHeight;
	this.radius--;

	this.scale.x = 0.25;
	this.scale.y = -0.25;

	this.update = function (data) {
		this.animations.update(data);
		//console.log(this.health);
		this.health.updateHealthbar(data);

		if (this.isMinerTargeted()) {
			for (var i = 0; i < StateMachine.getState().enemies.length; i++) {

			}
		}

		if() {
			if(this.speed > 0)
			{
				this.speed = 0;
			}
			if (this.speed > -this.maxSpeed)
			{
				this.speed-=0.5;
			}
		}
		else if()
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

		if(this.speed == 0)
		{
			this.animations.pause("walk");
		}
		else
		{
			this.animations.resume("walk");
		}

		var wobble = Math.sin(this.angle*Math.PI/180*50);

		this.position.x = this.world.position.x + Math.cos(this.angle * Math.PI / 180) * this.radius;
		this.position.y = this.world.position.y + Math.sin(this.angle * Math.PI / 180) * (this.radius + wobble*4);

		this.rotation = this.angle*Math.PI/180+Math.PI/2;

		this.angle+=this.speed*data.dt;
	};

	Game.PIXI.Camera.addChild(this);
};