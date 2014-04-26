var Miner = function () {
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprMinerWalk.png']);

	this.animations = {};

	extend(this, sprite);
	extend(this.animations, AnimationManager());

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
	this.maxSpeed = 8;

	this.jumpHeight = -10;

	var frames = [];

	for(var i = 0; i < 16; i++)
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
};