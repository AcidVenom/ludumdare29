var Player = function(angle, world)
{
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprCharacterWalk.png']);

	this.animations = {};

	extend(this,sprite);
	extend(this.animations, AnimationManager());

	this.collisionPoint = 330;
	this.world = world;
	this.angle = angle;
	this.radius = this.collisionPoint;
	this.velocity = 0;
	this.position.x = 0;
	this.position.y = 0;
	this.followPoint = {x: 0, y: 0};
	this.puffs = [];

	this.anchor.x = 0.5;
	this.anchor.y = 0.5;

	this.pivot.x = 0.5;
	this.pivot.y = 0.5;

	this.speed = 0;
	this.maxSpeed = 12;

	this.jumpHeight = -10;
	this.slamming = false;
	this.smashing = false;

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

	this.scale.x = 0.35;
	this.scale.y = 0.35;

	this.setTexture(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprCharacterSlam.png']);

	var frames = [];

	for(var i = 0; i < 11; i++)
	{
		frames.push({
			x: i*360,
            y: 0,
            width: 360,
            height: 318
		});
	}
	
	this.animations.mainSprite = this;
	this.animations.add("slam",{
        frameRate: 0.1,
        frames: frames,
        loop: true,
        reversed: false,
        cb: function(){ StateManager.getState().player.slamming = false; StateManager.getState().player.animations.play("walk"); }
	});

	this.setTexture(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprCharacterGodSmash.png']);

	var frames = [];

	for(var i = 0; i < 26; i++)
	{
		frames.push({
			x: i*221,
            y: 0,
            width: 221,
            height: 224
		});
	}
	
	this.animations.mainSprite = this;
	this.animations.add("smash",{
        frameRate: 0.3,
        frames: frames,
        loop: true,
        reversed: false,
        cb: function () { 
        	if (!calledBack) {
        		StateManager.getState().player.animations.stop("smash");
	        	animateHammer(hammer1);
	        	animateHammer(hammer2);
	        	animateHammer(hammer3, function () {
	        		CameraController.shake(35, 0.02, 10, function () {
	        			StateManager.getState().player.scale = {
		        			x: 0.35,
		        			y: 0.35
		        		}; 
		        		StateManager.getState().player.smashing = false; 
		        		StateManager.getState().player.animations.play("walk");

		        		hammer1.position.x = 320;
						hammer1.position.y = -254;
						hammer2.position.x = 640;
						hammer2.position.y = -254;
						hammer3.position.x = 960;
						hammer3.position.y = -254;
						calledBack = false;
	        		});
	        	});
	        	calledBack = true;
	        }
        }
	});

	var calledBack = false,
		hammer1 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprHammer.png']),
		hammer2 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprHammer.png']),
		hammer3 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprHammer.png']),
		animateHammer = function (hammer, cb) {
			hammer.pivot.x = 0.5;
			hammer.pivot.y = 0.5;
			hammer.anchor.x = 0.5;
			hammer.anchor.y = 0.5;
			var tweenVars = {
				r: Math.random() * 5
			};
			TweenLite.to(
				hammer.position,
				1,
				{
					x: 600,
					y: 500,
					ease: Quad.easeIn,
					onComplete: function () {
						if (cb) {
							cb();
						}
					}
				}
			);
			TweenLite.to(
				tweenVars,
				1,
				{
					r: tweenVars.r + 15,
					ease: Quad.easeIn,
					onUpdate: function () {
						hammer.rotation = tweenVars.r;
					}
				}
			);
		};
	hammer1.position.x = 320;
	hammer1.position.y = -254;
	hammer2.position.x = 640;
	hammer2.position.y = -254;
	hammer3.position.x = 960;
	hammer3.position.y = -254;
	Game.PIXI.Stage.addChild(hammer1);
	Game.PIXI.Stage.addChild(hammer2);
	Game.PIXI.Stage.addChild(hammer3);

	this.animations.play("walk");

	this.update = function(data)
	{
		this.animations.update(data);

		if(this.radius == this.collisionPoint)
		{
			this.puffs.push(new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPuff.png']));
			var puff = this.puffs[this.puffs.length-1];
			puff.position.x = this.position.x-Math.cos(this.angle*Math.PI/180)*20-Math.random()*10 + Math.random()*20;
			puff.position.y = this.position.y-Math.sin(this.angle*Math.PI/180)*20-Math.random()*10 + Math.random()*20;
			puff.scale.x = 0.1;
			puff.scale.y = puff.scale.x;
			puff.lifeTime = 0;
			puff.anchor.x = 0.5;
			puff.anchor.y = 0.5;
			puff.pivot.x = 0.5;
			puff.pivot.y = 0.5;
			puff.alpha = Math.abs(this.speed)*0.05;
			puff.rotation = Math.random()*360*Math.PI/180;
			Game.PIXI.Camera.addChild(puff);
		}

		for(var i = 0; i < this.puffs.length-1; ++i)
		{
			this.puffs[i].lifeTime++;
			this.puffs[i].rotation += 0.001;
			this.puffs[i].position.x -= Math.cos(this.angle*Math.PI/180-Math.PI*this.speed/this.maxSpeed)*1;
			this.puffs[i].position.y -= Math.sin(this.angle*Math.PI/180-Math.PI*this.speed/this.maxSpeed)*1;
			this.puffs[i].scale.x += Math.abs(this.speed)*0.0025;
			this.puffs[i].scale.y = this.puffs[i].scale.x;
			this.puffs[i].alpha -= 0.025;

			if (this.puffs[i].alpha < 0)
			{
				Game.PIXI.Camera.removeChild(this.puffs[i]);
				this.puffs.splice(i,1);
			}
		}

		if (Input.isDown("q"))
		{
			if (!this.slamming)
			{
				this.slamming = true;
				this.animations.setAnimation("slam");
				this.speed = 0;
				if(StateManager.getState().stability - 20 <= 0)
				{
					StateManager.getState().stability = 0;
				}
				else
				{
					StateManager.getState().stability -= 20;
				}
			}
		}

		if (Input.isDown("w"))
		{
			if (!this.smashing)
			{
				this.smashing = true;
				this.animations.setAnimation("smash");
				this.speed = 0;
				this.scale.x = 1;
				this.scale.y = 1;
				this.position.x = 0;
				this.position.y = -500;
				Game.PIXI.Camera.position.y = 900;
				Game.PIXI.Camera.position.x = 600;
				if(StateManager.getState().stability - 20 <= 0)
				{
					StateManager.getState().stability = 0;
				}
				else
				{
					StateManager.getState().stability -= 20;
				}
			}
		}

		if ( StateManager.getState().stability < StateManager.getState().maxStability)
		{
			if (StateManager.getState().stability + 0.5 > StateManager.getState().maxStability)
			{
				StateManager.getState().stability = StateManager.getState().maxStability
			}
			else
			{
				StateManager.getState().stability += 0.5;
			}				
		}

		if(!this.slamming && !this.smashing)
		{

			if(Input.isDown("left"))
			{
				StateManager.getState().world.mountains.rotation+=0.0025;
				StateManager.getState().world.treeLine2.rotation-=0.005;
				StateManager.getState().world.clouds.rotation+=0.01;
				if(this.speed > 0)
				{
					this.speed = 0;
				}
				if (this.speed > -this.maxSpeed)
				{
					this.speed-=0.5;
				}
				this.animations.setAnimation("walk");
			}
			else if(Input.isDown("right"))
			{
				StateManager.getState().world.mountains.rotation-=0.0025;
				StateManager.getState().world.treeLine2.rotation+=0.005;
				StateManager.getState().world.clouds.rotation-=0.01;
				if(this.speed < 0)
				{
					this.speed = 0;
				}
				if (this.speed < this.maxSpeed)
				{
					this.speed+=0.5;
				}
				this.animations.setAnimation("walk");
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

			this.animations.setFramerate("walk",this.maxSpeed/20-Math.abs(this.speed)/20);

			if(this.speed == 0)
			{
				this.animations.pause("walk");
			}
			else
			{
				this.animations.resume("walk");
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
			this.velocity = 0;
		}

		if (this.radius == this.collisionPoint && Input.isDown("space"))
		{
			this.velocity = this.jumpHeight;
			this.radius++;
		}
		if(this.speed > 0)
		{
			this.scale.x = -0.35;

			TweenLite.to(
				Game.PIXI.Camera.scale,
				3,
				{
					x: 1,
					y: 1
				},
				Linear.easeIn
			)
			

		}
		else if(this.speed < 0)
		{
			this.scale.x = 0.35;

			TweenLite.to(
				Game.PIXI.Camera.scale,
				3,
				{
					x: 1,
					y: 1
				},
				Linear.easeIn
			)

		}
		else
		{
			TweenLite.to(
				Game.PIXI.Camera.scale,
				2,
				{
					x: 1.3,
					y: 1.3
				},
				Bounce.easeOut
			)
		}


		if (!this.smashing) {
			var wobble = Math.sin(this.angle*Math.PI/180*20);

			this.position.x = Math.cos(this.angle * Math.PI / 180) * this.radius;
			this.position.y = Math.sin(this.angle * Math.PI / 180) * (this.radius + wobble*4);

			this.rotation = this.angle*Math.PI/180+Math.PI/2;

			this.angle+=this.speed*data.dt;

			var dx = 590-this.position.x/4 - Game.PIXI.Camera.position.x;
			var dy = 360-this.position.y/4 - Game.PIXI.Camera.position.y;

			var distance = Math.sqrt(dx*dx + dy*dy);

			var movement = Math.Slerp(Game.PIXI.Camera.position.x, Game.PIXI.Camera.position.y, 590-this.position.x / 4, 360 - this.position.y / 4, distance / 2 * data.dt);

			if (movement !== null)
			{
				Game.PIXI.Camera.position.x += movement.x;
				Game.PIXI.Camera.position.y += movement.y;
			}
		}
	}

	Game.PIXI.Camera.addChild(this);
}