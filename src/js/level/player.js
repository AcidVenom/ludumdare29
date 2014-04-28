var StoneChunk = function(player,prevChunk,dir,chunkCount)
{
	var chunkcount = chunkCount;

	this.prev = prevChunk;
	this.dir = dir;


	this.setPrevScale = function()
	{
		if(this.prev)
		{
			if(this.prev.scale.x - 0.05 > 0)
			{
				this.prev.scale.x -= 0.05;
				this.prev.scale.y -= 0.05;
			}
			else
			{
				this.prev.scale.x = 0;
				this.prev.scale.y = 0;
			}
			this.prev.setPrevScale();
		}
	}

	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/particles/partRock' + String(Math.floor(Math.random()*5) + 1) + '.png']);
	extend(this,sprite);

	if(this.dir == 0)
	{
		sprite.position.x = Math.cos((player.angle + chunkcount * 3) * Math.PI / 180) * (player.collisionPoint-20);
		sprite.position.y = Math.sin((player.angle + chunkcount * 3) * Math.PI / 180) * (player.collisionPoint-20);
	}
	else
	{
		sprite.position.x = Math.cos((player.angle - chunkcount * 3) * Math.PI / 180) * (player.collisionPoint-20);
		sprite.position.y = Math.sin((player.angle - chunkcount * 3) * Math.PI / 180) * (player.collisionPoint-20);
	}
	
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
	
	sprite.pivot.x = 0.5;
	sprite.pivot.y = 0.5;

	sprite.scale.x = 0.8+Math.random()*0.3;
	sprite.rotation = Math.random()*Math.PI;

	this.__z = 600;

	Game.PIXI.Camera.addChild(this);

	if(chunkcount < 60)
	{
		if(this.dir == 0)
		{
			Game.PIXI.Camera.x = 640 - sprite.position.x + Math.random()*32;
			Game.PIXI.Camera.y = 360 - sprite.position.y + Math.random()*32;
		}
		var self = this;
		setTimeout(function()
		{
			var chunk = new StoneChunk(player,self,self.dir,++chunkcount);
			if(self.prev)
			{
				self.setPrevScale();
			}

		},10/StateManager.getState().world.timeScale);
	}
	else
	{
		StateManager.getState().world.createImpact(StateManager.getState().player.angle - chunkcount * 3,300,80);
		var self = this;
		setTimeout(function(){
			player.cameraUnlocked = false;
			player.chunkCount = 0;
			player._180 = false;
			player.anchor.x = 0.5;
			player.anchor.y = 0.5;

			Game.PIXI.Camera.removeChild(self);
			var current = self.prev;
			while(current.prev)
			{
				Game.PIXI.Camera.removeChild(current);
				current = current.prev;
			}
			StateManager.getState().world.timeScale = 1;
			Game.PIXI.Camera.removeChild(current);
		},500);
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
	this._360Casted = false;
	this.world = world;
	this.angle = angle;
	this.radius = this.collisionPoint;
	this.velocity = 0;
	this.position.x = 0;
	this.position.y = 0;
	this.followPoint = {x: 0, y: 0};
	this.puffs = [];
	this.__z = 800;
	this.chunkCount = 0;

	this.anchor.x = 0.5;
	this.anchor.y = 0.5;

	this.pivot.x = 0.5;
	this.pivot.y = 0.5;

	this.speed = 0;
	this.maxSpeed = 12;

	this.jumpHeight = -14;
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
        loop: false,
        reversed: false,
        cb: function(){ 
        	StateManager.getState().player.cameraUnlocked = true;
        	StateManager.getState().world.createImpact(StateManager.getState().player.angle,112,80);
        	StateManager.getState().player.animations.play("walk"); 
        	StateManager.getState().player.slamming = false;

			CameraController.shake(20, 0.025, 5, function () {
				StateManager.getState().player.cameraUnlocked = false; 
			});
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
        	
        	if(PowerupManager.powerupStates.infiniteStability.timeLeft <= 0) {
	        	if(StateManager.getState().stability - 80 < 0)
	        	{
	        		StateManager.getState().stability = 0;
	        	}
	        	else
	        	{
	        		StateManager.getState().stability -= 80;
	        	}
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
					if(PowerupManager.powerupStates.infiniteStability.timeLeft <= 0) {
						if(StateManager.getState().stability - 60 <= 0)
						{
							StateManager.getState().stability = 0;
						}
						else
						{
							StateManager.getState().stability -= 60;
						}
					}

					StateManager.getState().world.createImpact(StateManager.getState().player.angle,400,150);

					if (player.particles.smashExplosion) {
						player.particles.removeEmitter(player.particles.smashExplosion);
					};
					player.particles.smokeEffects = player.particles.createEmitter({
						parent: Game.PIXI.Camera,
						texture: PIXI.TextureCache[Utils.Assets.Images + 'level/sprPuff.png'],
						instantEmitSize: 50,
						lifetime: 50000000,
						onParticleInitialization: function (particle) {
							particle.position = {
								x: Math.cos(player.angle * Math.PI / 180) * (player.radius) ,
								y: Math.sin(player.angle * Math.PI / 180) * (player.radius)
							};
							particle.pivot.x = 0.5;
							particle.pivot.y = 0.5;
							particle.anchor.x = 0.5;
							particle.anchor.y = 0.5;
							particle.direction = Math.floor(Math.random()*2);
							particle.active = true;
							particle.__z = 5000;
							particle.angle = player.angle - 20 + Math.random()*40;
							particle.randomRadius = 0;
							particle.startRadius = player.radius + Math.random() * 20;
							particle.speed = Math.random();
							particle.scale.x = 0.4;
							particle.rotationSpeed = 0.4;
							particle.fadeSpeed = 0.05;
							particle.scale.y = 0.4;
							particle.y = (Math.random() * 50) - 25;
							particle.velocity = 5+Math.random()*10;

						},
						onParticleUpdate: function (particle, data) {
							particle.rotation += particle.rotationSpeed;

							if(particle.alpha > 0)
							{
								particle.alpha -= particle.fadeSpeed;
							}

							if(particle.direction == 0)
							{
								particle.angle += particle.speed;
							}
							else
							{
								particle.angle -= particle.speed;
							}

							if(particle.velocity > 0.3)
							{
								particle.velocity -= 0.3;
							}
							
							particle.y += particle.velocity;

							particle.scale.x += 0.01;
							particle.scale.y += 0.01;

							if (particle.alpha <= particle.fadeSpeed)
							{
								particle.active = false;
							}
							

							particle.position = {
								x: Math.cos(particle.angle * Math.PI / 180) * (particle.startRadius + particle.y + particle.randomRadius),
								y: Math.sin(particle.angle * Math.PI / 180) * (particle.startRadius + particle.y + particle.randomRadius)
							};
						}
					});
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
							particle.__z = 5001;
						},
						onParticleUpdate: function (particle, data) {
							if(particle.direction == 0)
							{
								particle.targetAngle+=particle.bounce/10*data.dt*StateManager.getState().world.timeScale;
								particle.rotation += 2*data.dt*StateManager.getState().world.timeScale;
							}
							else
							{
								particle.targetAngle-=particle.bounce/10*data.dt*StateManager.getState().world.timeScale;
								particle.rotation -= 0.5*data.dt*StateManager.getState().world.timeScale;
							}

							if(particle.scale.x > 0)
							{
								particle.alpha-=0.01*data.dt*StateManager.getState().world.timeScale;

								particle.scale.x-=0.01*data.dt*StateManager.getState().world.timeScale;
								particle.scale.y-=0.01*data.dt*StateManager.getState().world.timeScale;
							}

							if(particle.scale.x <= 0)
							{
								particle.alpha = 0;

								particle.scale.x = 0;
								particle.scale.y = 0;
							}

							if(particle.radius > player.collisionPoint)
							{
								particle.velocity+=2*data.dt*StateManager.getState().world.timeScale;
								particle.radius -= particle.velocity-Math.random()*5*data.dt*StateManager.getState().world.timeScale;
							}

							if(particle.radius <= player.collisionPoint && particle.bounce > 0)
							{
								particle.radius = player.collisionPoint+1;
								particle.bounce -= 5;
								particle.velocity = -particle.bounce*data.dt*StateManager.getState().world.timeScale*2;
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
					player.particles.smokeEffects.__z = 10000;
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

	this.setTexture(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprCharacter360Teleport.png']);
	var frames = [];
	for(var i = 0; i < 10; i++)
	{
		frames.push({
			x: i*564,
            y: 0,
            width: 564,
            height: 351
		});
	}
	this.animations.mainSprite = this;
	this.animations.add("teleport",{
        frameRate: 0.5,
        frames: frames,
        loop: false,
        reversed: false,
        cb: function(){ 
        	var player = StateManager.getState().player;
        	player.alpha = 0;
        	player.animations.pause('teleport');

        	for (var i = 0; i < player.attackSprites.length; i++) {
        		player.attackSprites[i].animations.play('flame');
        		player.attackSprites[i].alpha = 1;
        	}
        }
	});

	this.attackSprites = [];
	for (var i = 0; i < 6; i++) {
		var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/characters/sprCharacter360Flame.png']),
			frames = [];
		sprite.animations = {};
		sprite.particles = {};
		extend(sprite.animations, AnimationManager());
		extend(sprite.particles, ParticleSystem());

		sprite.animations.mainSprite = sprite;
		sprite.__z = 80000;
		
		for(var i2 = 0; i2 < 19; i2++)
		{
			frames.push({
				x: i2*300,
	            y: 0,
	            width: 300,
	            height: 441
			});
		}

		sprite.alpha = 0;
		sprite.angle = i * 60 - 20;
		sprite.animations.i = i;
		sprite.radius = this.collisionPoint + 330;
		sprite.collisionPoint = this.collisionPoint;
		sprite.rotation = sprite.angle*Math.PI/180+Math.PI/2;
		sprite.position.x = Math.cos(sprite.angle * Math.PI / 180) * sprite.radius;
		sprite.position.y = Math.sin(sprite.angle * Math.PI / 180) * sprite.radius;
		this.attackSprites.push(sprite);

		Game.PIXI.Camera.addChild(sprite);
		sprite.animations.add("flame",{
			i: i,
	        frameRate: 0.5,
	        frames: frames,
	        loop: false,
	        reversed: false,
	        cb: function () { 
	        	var sprite = StateManager.getState().player.attackSprites[this.i];
	        	if (sprite.particles.smashExplosion) {
					sprite.particles.removeEmitter(sprite.particles.smashExplosion);
				};
				sprite.particles.smokeEffects = sprite.particles.createEmitter({
					parent: Game.PIXI.Camera,
					texture: PIXI.TextureCache[Utils.Assets.Images + 'level/sprPuff.png'],
					instantEmitSize: 50,
					lifetime: 50000000,
					onParticleInitialization: function (particle) {
						particle.position = {
							x: Math.cos(sprite.angle * Math.PI / 180) * (sprite.radius),
							y: Math.sin(sprite.angle * Math.PI / 180) * (sprite.radius)
						};
						particle.pivot.x = 0.5;
						particle.pivot.y = 0.5;
						particle.anchor.x = 0.5;
						particle.anchor.y = 0.5;
						particle.direction = Math.floor(Math.random()*2);
						particle.active = true;
						particle.__z = 5000;
						particle.angle = sprite.angle - 20 + Math.random()*40;
						particle.randomRadius = 0;
						particle.startRadius = sprite.radius + Math.random() * 20 - 300;
						particle.speed = Math.random();
						particle.scale.x = 0.4;
						particle.rotationSpeed = 0.4;
						particle.fadeSpeed = 0.05;
						particle.scale.y = 0.4;
						particle.y = (Math.random() * 50) - 25;
						particle.velocity = 5+Math.random()*10;
					},
					onParticleUpdate: function (particle, data) {
						particle.rotation += particle.rotationSpeed;

						if(particle.alpha > 0)
						{
							particle.alpha -= particle.fadeSpeed;
						}

						if(particle.direction == 0)
						{
							particle.angle += particle.speed;
						}
						else
						{
							particle.angle -= particle.speed;
						}

						if(particle.velocity > 0.3)
						{
							particle.velocity -= 0.3;
						}
						
						particle.y += particle.velocity;

						particle.scale.x += 0.01;
						particle.scale.y += 0.01;

						if (particle.alpha <= particle.fadeSpeed)
						{
							particle.active = false;
						}

						particle.position = {
							x: Math.cos(particle.angle * Math.PI / 180) * (particle.startRadius + particle.y + particle.randomRadius),
							y: Math.sin(particle.angle * Math.PI / 180) * (particle.startRadius + particle.y + particle.randomRadius)
						};
					}
				});
				sprite.particles.smokeEffects.__z = 10000;

				StateManager.getState().player._360 = false;
				StateManager.getState().player.alpha = 1;
				StateManager.getState().player.animations.play('walk');
				StateManager.getState().world.createImpact(0, 1500, 100);
				CameraController.shake(45, 0.02, 20, function () {
					StateManager.getState().player.cameraUnlocked = false;
				});

			 	sprite.animations.pause('flame');
	        }
		});
	}

	this.animations.play("walk");
	this.cameraUnlocked = false;
	this.startChain = function()
	{
		var chunk1 = new StoneChunk(this,undefined,0,0),
			chunk2 = new StoneChunk(this,undefined,1,0);
	}

	this.update = function(data)
	{
		if(StateManager.getState().stability <= 0 || StateManager.getState().miners.length < 1)
		{

			if(StateManager.getState().stability <= 0)
			{
				StateManager.getState().ui.deathReason.setText("The mines have collapsed due to heavy tremors!\nKeep in mind that you have a stability bar!\n\n\n\n\n\nPress ENTER to continue");
			}

			if(StateManager.getState().miners.length < 1)
			{
				StateManager.getState().ui.deathReason.setText("All your dwarves have died!\nKill goblins to protect them!\n\n\n\n\n\nPress ENTER to continue");
			}
			StateManager.getState().gameOver = true;
			this.cameraUnlocked = true;

			TweenLite.to(
				Game.PIXI.Camera.position,
				0.5,
				{
					x: 640,
					y: 360,
					ease: Linear.easeIn
				}
			)
		}
		for (var i = 0; i < this.attackSprites.length; i++) {
			this.attackSprites[i].animations.update(data);
			this.attackSprites[i].particles.update(data);
		}
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

		if(StateManager.getState().gameOver == false)
		{
			StateManager.getState().world.mountains.rotation+=0.008*data.dt*StateManager.getState().world.timeScale;
			StateManager.getState().world.treeLine2.rotation-=0.004*data.dt*StateManager.getState().world.timeScale;
			StateManager.getState().world.treeLine2.rotation-=0.02*data.dt*StateManager.getState().world.timeScale;
			StateManager.getState().world.clouds.rotation+=0.01*data.dt*StateManager.getState().world.timeScale;

			Game.PIXI.Camera.filters[0].uniforms.exposure.value = -Math.abs(Math.sin(StateManager.getState().world.clouds.rotation))/2;
			Game.PIXI.Camera.filters[0].uniforms.saturation.value = -Math.abs(Math.sin(StateManager.getState().world.clouds.rotation))/2;
			StateManager.getState().world.setFlareAlpha(Math.abs(Math.sin(StateManager.getState().world.clouds.rotation)));

			if(this.radius == this.collisionPoint && (this.speed > 0 || this.speed < 0))
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
				this.puffs[i].rotation += 0.1*data.dt*StateManager.getState().world.timeScale;
				this.puffs[i].position.x -= Math.cos(this.angle*Math.PI/180-Math.PI*this.speed/this.maxSpeed)*10*data.dt*StateManager.getState().world.timeScale;
				this.puffs[i].position.y -= Math.sin(this.angle*Math.PI/180-Math.PI*this.speed/this.maxSpeed)*10*data.dt*StateManager.getState().world.timeScale;
				this.puffs[i].scale.x += Math.abs(this.speed)*0.02*data.dt*StateManager.getState().world.timeScale;
				this.puffs[i].scale.y = this.puffs[i].scale.x;
				this.puffs[i].alpha -= 0.15*data.dt*StateManager.getState().world.timeScale;

				if (this.puffs[i].alpha < 0)
				{
					Game.PIXI.Camera.removeChild(this.puffs[i]);
					this.puffs.splice(i,1);
				}
			}

			if (Input.isDown("q"))
			{
				if (!this.slamming && !this.smashing && !this._180 && !this._360)
				{
					this.slamming = true;
					this.animations.setAnimation("slam");
					this.speed = 0;

					if(PowerupManager.powerupStates.infiniteStability.timeLeft <= 0) {
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
			}

			if (Input.isDown("w"))
			{
				if (!this.smashing && !this.slamming && !this._180 && !this._360)
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
				if (!this.slamming && !this.smashing && !this._180 && !this._360)
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
			if (Input.isDown("r"))
			{
				if (!this.slamming && !this.smashing && !this._180 && !this._360 && !this._360Casted)
				{
					this._360Casted = true;
					this._360 = true;
					this.animations.play("teleport");
					this.speed = 0;
					this.cameraUnlocked = true;
					TweenLite.to(
						Game.PIXI.Camera.position,
						0.5,
						{
							x: 640,
							y: 360,
							ease: Linear.easeInOut
						}
					);
					TweenLite.to(
						Game.PIXI.Camera.scale,
						0.5,
						{
							x: 0.62,
							y: 0.62,
							ease: Linear.easeInOut
						}
					);/*
					TweenLite.to(
					Game.PIXI.Camera.scale,
					2,
					{
						x: 0.95,
						y: 0.95,
						ease: Linear.easeIn
					});*/
				}
			}

			if ( StateManager.getState().stability < StateManager.getState().maxStability && !this.smashing && !this.slamming && !this._180)
			{
				if (StateManager.getState().stability + 2* data.dt*StateManager.getState().world.timeScale > StateManager.getState().maxStability)
				{
					StateManager.getState().stability = StateManager.getState().maxStability
				}
				else
				{
					StateManager.getState().stability += 2* data.dt*StateManager.getState().world.timeScale;
				}				
			}

			if(!this.slamming && !this.smashing && !this._180 && !this._360)
			{
				if(Input.isDown("left"))
				{
					
					if(this.speed > 0)
					{
						this.speed = 0;
					}
					if (this.speed > -this.maxSpeed)
					{
						this.speed-=3*data.dt*StateManager.getState().world.timeScale;
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
						this.speed+=3*data.dt*StateManager.getState().world.timeScale;
					}
					this.animations.setAnimation("walk");
				}
				else
				{
					if(this.speed > 0)
					{
						this.speed-=3*data.dt*StateManager.getState().world.timeScale;
					}
					else if(this.speed < 0)
					{
						this.speed+=3*data.dt*StateManager.getState().world.timeScale;
					}
				}

				if(this.speed > -3*data.dt*StateManager.getState().world.timeScale && this.speed < 3*data.dt*StateManager.getState().world.timeScale)
				{
					this.speed = 0;
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
				this.velocity += 5*data.dt*StateManager.getState().world.timeScale;
				this.radius-=5*this.velocity*data.dt*StateManager.getState().world.timeScale;
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

				this.angle+=this.speed*data.dt*StateManager.getState().world.timeScale;

				var dx = 640-this.position.x/4 - Game.PIXI.Camera.position.x;
				var dy = 360-this.position.y/4 - Game.PIXI.Camera.position.y;

				var distance = Math.sqrt(dx*dx + dy*dy);

				var movement = Math.Slerp(Game.PIXI.Camera.position.x, Game.PIXI.Camera.position.y, 640-this.position.x / 4, 360 - this.position.y / 4, distance / 2 * data.dt*StateManager.getState().world.timeScale);

				if (movement !== null)
				{
					Game.PIXI.Camera.position.x += movement.x;
					Game.PIXI.Camera.position.y += movement.y;
				}
			}
		}
		else
		{
			this.radius = this.collisionPoint;
			this.position.x = Math.cos(this.angle * Math.PI / 180) * this.radius;
			this.position.y = Math.sin(this.angle * Math.PI / 180) * (this.radius + wobble*4);
		}
	}

	Game.PIXI.Camera.addChild(this);
}