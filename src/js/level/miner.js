var Miner = function (angle,world,hotspot) {
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

	// AI variables
	this.AI = {};
	this.AI.currentState = null;
	this.AI.currentTargetAngle = null;
	this.AI.currentTargetStepsTaken = 0;
	this.AI.distanceToTarget = function (bool) {
		if (this.currentTargetAngle !== null) {
			var distToTarget;
			if (bool) {
				distToTarget = this.angle - this.currentTargetAngle;
			} else {
				distToTarget = this.angle > this.currentTargetAngle ? this.angle - this.currentTargetAngle : this.currentTargetAngle - this.angle;
			}
			return distToTarget;
		}
		return 0;
	};
	this.AI.calculateNextTarget = function () {
		var distToHotspot = this.angle > this.hotspot ? this.angle - this.hotspot : this.hotspot - this.angle,
			chance;

		if (distToHotspot <= 20) {
			chance = 90;
		} else if (distToHotspot <= 40) {
			chance = 70;
		} else if (distToHotspot <= 60) {
			chance = 50;
		} else if (distToHotspot <= 80) {
			chance = 20;
		} else {
			chance = 10;
		}

		if (Math.round(Math.random() * 100) <= chance) {
			return (this.hotspot - 20) + Math.round(Math.random() * 40);
		} else {
			return (this.angle - 20) + Math.round(Math.random() * 40);
		}

		return 0;
	};

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

	this.scale.x = 0.35;
	this.scale.y = -0.35;

	this.update = function (data) {
		this.animations.update(data);
		//console.log(this.health);
		this.health.updateHealthbar(data);

		if (this.AI.currentState !== null) {
			switch(Math.round(Math.random() * 1)) {
				case 0:
					console.log('heybhfd');
					this.AI.currentState = 'idle';
				break;
				case 1:
					this.AI.currentTargetAngle = this.AI.calculateNextTarget();
					this.AI.currentState = 'targeted';
					console.log('fdsakljdkfh');
				break;
			}
		} else if (this.AI.currentTargetAngle === this.angle || !this.AI.currentTargetAngle) {
			console.log('h');
			this.AI.currentTargetAngle = this.hotspot;
		}

		if(this.AI.distanceToTarget() !== 0 && this.AI.distanceToTarget(true) <= 20) {
			console.log(1);
			if(this.speed > 0)
			{
				this.speed = 0;
			}
			if (this.speed > -this.maxSpeed)
			{
				this.speed-=0.5;
			}
		}
		else if(this.AI.distanceToTarget() !== 0 && this.AI.distanceToTarget(true) >= 20)
		{
			console.log(2);
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
			//console.log(3);
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