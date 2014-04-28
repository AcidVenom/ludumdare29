var StoneChunk = function(player)
{
	if(player.chunkCount < 40)
	{
		Game.PIXI.Camera.x = 640 - Math.cos((player.angle + player.chunkCount * 5.25) * Math.PI / 180) * player.collisionPoint + Math.random()*32;
		Game.PIXI.Camera.y = 360 - Math.sin((player.angle + player.chunkCount * 5.25) * Math.PI / 180) * player.collisionPoint + Math.random()*32;
		setTimeout(function()
		{
			var chunk = new StoneChunk(player);
		},20)
	}
	else
	{
		player.cameraUnlocked = false;
		player.chunkCount = 0;
		player._180 = false;
	}
	player.chunkCount++;
}



var Player = function(angle, world)
{
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprCharacterWalk.png']);

	this.animations = {};
	this.particles = {};

	extend(this,sprite);
	extend(this.animations, AnimationManager());
	extend(this.particles, ParticleSystem());

	this.collisionPoint = 330;
	this.world = world;
	this.angle = angle;
	this.radius = this.collisionPoint;
	this.velocity = 0;
	this.position.x = 0;
	this.position.y = 0;
	this.followPoint = {x: 0, y: 0};
	this.puffs = [];
	this.__z = 6;
	this.chunkCount = 0;

	this.anchor.x = 0.5;
	this.anchor.y = 0.5;

	this.pivot.x = 0.5;
	this.pivot.y = 0.5;

	this.speed = 0;
	this.maxSpeed = 12;

	this.jumpHeight = -10;
	this.slamming = false;
	this.smashing = false;
	this._180 = false;

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
        cb: function(){ 
        	StateManager.getState().player.cameraUnlocked = true;
			CameraController.shake(20, 0.025, 5, function () {
				StateManager.getState().player.cameraUnlocked = false;
			});
        	StateManager.getState().player.slamming = false; 
        	StateManager.getState().player.animations.play("walk"); 
        	StateManager.getState().world.createImpact(StateManager.getState().player.angle,112,80);
        }
	});

	this.setTexture(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprCharacter180.png']);

	var frames = [];

	for(var i = 0; i < 19; i++)
	{
		frames.push({
			x: i*378,
            y: 0,
            width: 378,
            height: 672
		});
	}
	
	this.animations.mainSprite = this;
	this.animations.add("180",{
        frameRate: 0.2,
        frames: frames,
        loop: false,
        reversed: false,
        cb: function(){ 
        	StateManager.getState().player.animations.play("walk"); 
        	StateManager.getState().player.radius = StateManager.getState().player.collisionPoint;
        	if(StateManager.getState().stability - 80 < 0)
        	{
        		StateManager.getState().stability = 0;
        	}
        	else
        	{
        		StateManager.getState().stability -= 80;
        	}
        }
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
        frameRate: 0.2,
        frames: frames,
        loop: true,
        reversed: false,
        cb: function () { 
        	if (!calledBack) {
        		var player = StateManager.getState().player;
        		StateManager.getState().player.animations.stop("smash");
	        	animateHammer(hammer1, -20);
	        	animateHammer(hammer2, 0);
	        	animateHammer(hammer3, 20, function () {
	        		//Game.PIXI.Camera.scale.x = 0.5;
					//Game.PIXI.Camera.scale.y = 0.5;
					if(StateManager.getState().stability - 60 <= 0)
					{
						StateManager.getState().stability = 0;
					}
					else
					{
						StateManager.getState().stability -= 60;
					}

					StateManager.getState().world.createImpact(StateManager.getState().player.angle,400,150);

					if (player.particles.smashExplosion) {
						player.particles.removeEmitter(player.particles.smashExplosion);
					};
					player.particles.smashExplosion = player.particles.createEmitter({
						parent: Game.PIXI.Camera,
						texture: PIXI.TextureCache[Utils.Assets.Images + 'level/particles/partRock1.png'],
						instantEmitSize: 100,
						lifetime: 50000000,
						onParticleInitialization: function (particle) {
							particle.position = {
								x: Math.cos(player.angle * Math.PI / 180) * (player.radius),
								y: Math.sin(player.angle * Math.PI / 180) * (player.radius)
							};
							particle.pivot.x = 0.5;
							particle.pivot.y = 0.5;
							particle.anchor.x = 0.5;
							particle.anchor.y = 0.5;
							particle.targetAngle = player.angle + (Math.round(Math.random() * 20) - 10) % 360;
							particle.radius = player.radius;
							particle.scale.x = 0.5;
							particle.scale.y = 0.5;
							particle.velocity = 0;
							particle.bounce = 5+Math.floor(Math.random()*20);
							particle.direction = Math.floor(Math.random()*2);
							particle.active = true;
						},
						onParticleUpdate: function (particle, data) {
							if(particle.direction == 0)
							{
								particle.targetAngle+=particle.bounce/30;
								particle.rotation += 0.1;
							}
							else
							{
								particle.targetAngle-=particle.bounce/30;
								particle.rotation -= 0.1;
							}

							if(particle.scale.x > 0)
							{
								particle.alpha-=0.001;

								particle.scale.x-=0.005;
								particle.scale.y-=0.005;
							}

							if(particle.scale.x <= 0)
							{
								particle.alpha = 0;

								particle.scale.x = 0;
								particle.scale.y = 0;
							}

							if(particle.radius > player.collisionPoint)
							{
								particle.velocity+=0.5;
								particle.radius -= particle.velocity-Math.random()*5;
							}

							if(particle.radius <= player.collisionPoint && particle.bounce > 0)
							{
								particle.radius = player.collisionPoint+1;
								particle.bounce -= 5;
								particle.velocity = -particle.bounce/2;
							}

							if(particle.bounce < 1)
							{
								particle.velocity = 0;
								particle.bounce = 0;
								particle.radius = player.collisionPoint;

								particle.active = false;
							}

							particle.position = {
								x: Math.cos(particle.targetAngle * Math.PI / 180) * particle.radius,
								y: Math.sin(particle.targetAngle * Math.PI / 180) * particle.radius
							};
						}
					});
					player.particles.smashExplosion.__z = 10000;

	        		CameraController.shake(45, 0.03, 12, function () {
			        	TweenLite.to(
			        		player.position,
			        		0.3,
			        		{
			        			x: Math.cos(player.angle * Math.PI / 180) * (player.radius),
			        			y: Math.sin(player.angle * Math.PI / 180) * (player.radius),
			        			ease: Quad.easeIn,
			        			onComplete: function () {
			        				StateManager.getState().player.scale = {
					        			x: 0.35,
					        			y: 0.35
					        		}; 
					        		StateManager.getState().player.smashing = false; 
					        		StateManager.getState().player.animations.play("walk");

									calledBack = false;

									StateManager.getState().player.cameraUnlocked = false;
			        			}
			        		}
			        	);
	        			
	        		});
	        	});
	        	calledBack = true;
	        }
        }
	});

	this.animations.add("smash1", {
        frameRate: 0.6,
        frames: [{
			x: 221,
            y: 0,
            width: 221,
            height: 224
		}],
        loop: true,
        reversed: false,
        cb: function () { 
        	if (!calledBack) {
        		//StateManager.getState().player.animations.play('smash');
	        }
        }
	});

	var calledBack = false,
		hammer1 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprHammer.png']),
		hammer2 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprHammer.png']),
		hammer3 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprHammer.png']),
		animateHammer = function (hammer, start, cb) {
			var player = StateManager.getState().player;
			hammer.position.x = Math.cos((player.angle + start) * Math.PI / 180) * (player.radius + 350);
			hammer.position.y = Math.sin((player.angle + start) * Math.PI / 180) * (player.radius + 350);
			hammer.pivot.x = 0.5;
			hammer.pivot.y = 0.5;
			hammer.anchor.x = 0.5;
			hammer.anchor.y = 0.5;
			hammer.scale.x = 0.5;
			hammer.scale.y = 0.5;
			hammer.alpha = 1;
			var tweenVars = {
				r: Math.random() * 5,
				a: 1
			};
			TweenLite.to(
				hammer.position,
				0.4,
				{
					x: Math.cos(player.angle * Math.PI / 180) * (player.radius),
					y: Math.sin(player.angle * Math.PI / 180) * (player.radius),
					ease: Quad.easeIn,
					onComplete: function () {
						if (cb) {
							cb();
						}

						TweenLite.to(
							tweenVars,
							0.4,
							{
								a: 0,
								ease: Quad.easeIn,
								onUpdate: function () {
									hammer.alpha = tweenVars.a;
								}
							}
						);
					}
				}
			);
			TweenLite.to(
				tweenVars,
				0.4,
				{
					r: tweenVars.r + 10,
					ease: Quad.easeIn,
					onUpdate: function () {
						hammer.rotation = tweenVars.r;
					}
				}
			);
			TweenLite.to(
				hammer.scale,
				0.4,
				{
					x: 0.3,
					y: 0.3,
					ease: Quad.easeIn
				}
			);
		};
	extend(hammer1, GameObject());
	extend(hammer2, GameObject());
	extend(hammer3, GameObject());
	hammer1.setZ(500);
	hammer2.setZ(501);
	hammer3.setZ(500);

	hammer1.alpha = 0;
	hammer2.alpha = 0;
	hammer3.alpha = 0;

	Game.sort();
	Game.PIXI.Camera.addChild(hammer1);
	Game.PIXI.Camera.addChild(hammer2);
	Game.PIXI.Camera.addChild(hammer3);

	this.animations.play("walk");

	this.cameraUnlocked = false;

	this.startChain = function()
	{
		var chunk = new StoneChunk(this);
	}

	this.update = function(data)
	{
		this.animations.update(data);
		this.particles.update(data);

		if(this.angle > 360)
		{
			this.angle = 1;
		}

		if(this.angle < 0)
		{
			this.angle = 359;
		}

		StateManager.getState().world.mountains.rotation+=0.0008;
		StateManager.getState().world.treeLine2.rotation-=0.0004;
		StateManager.getState().world.treeLine2.rotation-=0.0020;
		StateManager.getState().world.clouds.rotation+=0.004;

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
			puff.__z = 1000;
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
			if (!this.slamming && !this.smashing && !this._180)
			{
				this.slamming = true;
				this.animations.setAnimation("slam");
				this.speed = 0;

				if(StateManager.getState().stability - 5 <= 0)
				{
					StateManager.getState().stability = 0;
				}
				else
				{
					StateManager.getState().stability -= 5;
				}
			}
		}

		if (Input.isDown("w"))
		{
			if (!this.smashing && !this.slamming && !this._180)
			{
				Game.sort();

				var player = this;
				this.smashing = true;
				this.cameraUnlocked = true;
				setTimeout(function () {
					StateManager.getState().player.animations.play('smash');
				}, 0);
				StateManager.getState().player.scale.x = 1;
				StateManager.getState().player.scale.y = 1;
				this.speed = 0;
				TweenLite.to(
					player.position,
					2.5,
					{
						x: Math.cos(player.angle * Math.PI / 180) * (player.radius + 150),
						y: Math.sin(player.angle * Math.PI / 180) * (player.radius + 150),
						ease: Quad.easeOut
					}
				);
				TweenLite.to(
					Game.PIXI.Camera.scale,
					1,
					{
						x: 0.85,
						y: 0.85,
						ease: Quad.easeInOut
					}
				);

				this.animations.play('smash1');
			}
		}

		if (Input.isDown("e"))
		{
			if (!this.slamming && !this.smashing && !this._180)
			{
				this._180 = true;
				this.animations.setAnimation("180");
				this.speed = 0;
				this.anchor.y = 0.9;
				this.pivot.y = 0.9;
				this.cameraUnlocked = true;
				var player = this;
				TweenLite.to(
					Game.PIXI.Camera.position,
					0.5,
					{
						x: 640 - Math.cos(player.angle * Math.PI / 180) * (player.radius + 10),
						y: 360 - Math.sin(player.angle * Math.PI / 180) * (player.radius + 10),
						ease: Linear.easeIn
					}
				);

				setTimeout(function(){
					StateManager.getState().player.startChain();

					TweenLite.to(
					Game.PIXI.Camera.scale,
					2,
					{
						x: 0.95,
						y: 0.95,
						ease: Linear.easeIn
					});

				},500);
			}
		}

		if ( StateManager.getState().stability < StateManager.getState().maxStability && !this.smashing && !this.slamming && !this._180)
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

		if(!this.slamming && !this.smashing && !this._180)
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
				this.animations.setAnimation("walk");
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
		else if (!this.cameraUnlocked)
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



		if (!this.cameraUnlocked) {
			var wobble = Math.sin(this.angle*Math.PI/180*20);
			this.position.x = Math.cos(this.angle * Math.PI / 180) * this.radius;
			this.position.y = Math.sin(this.angle * Math.PI / 180) * (this.radius + wobble*4);

			this.rotation = this.angle*Math.PI/180+Math.PI/2;

			this.angle+=this.speed*data.dt;

			var dx = 640-this.position.x/4 - Game.PIXI.Camera.position.x;
			var dy = 360-this.position.y/4 - Game.PIXI.Camera.position.y;

			var distance = Math.sqrt(dx*dx + dy*dy);

			var movement = Math.Slerp(Game.PIXI.Camera.position.x, Game.PIXI.Camera.position.y, 640-this.position.x / 4, 360 - this.position.y / 4, distance / 2 * data.dt);

			if (movement !== null)
			{
				Game.PIXI.Camera.position.x += movement.x;
				Game.PIXI.Camera.position.y += movement.y;
			}
		}
	}

	Game.PIXI.Camera.addChild(this);
}