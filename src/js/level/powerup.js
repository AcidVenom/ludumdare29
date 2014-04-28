var PowerupBar = function () {
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupBar.png']),
		container = new PIXI.DisplayObjectContainer();
	container.position.x = Game.PIXI.Camera.position.x - 640;
	container.position.y = Game.PIXI.Camera.position.y - 320;
	container.__z = 4000;
	sprite.__z = 4000;

	Game.PIXI.Stage.addChild(container);
	container.addChild(sprite);

	var slider1 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupBarSlider.png']),
		stretch1 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupBarStretch.png']),
		glow1 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupGlow.png']);
	slider1.position.x += 0;
	slider1.position.y += 80;
	stretch1.position.x += 1;
	stretch1.position.y += 17;
	stretch1.scale.y = 0.90;
	glow1.position.x -= 17;
	glow1.position.y += 48;
	glow1.alpha = 0;
	slider1.__z = 3000;
	stretch1.__z = 3000;
	glow1.__z = 4005;
	container.addChild(slider1);
	container.addChild(glow1);
	slider1.addChild(stretch1);

	var slider2 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupBarSlider.png']),
		stretch2 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupBarStretch.png']),
		glow2 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupGlow.png']);
	slider2.position.x += 0;
	slider2.position.y += 173;
	stretch2.position.x += 1;
	stretch2.position.y += 17;
	stretch2.scale.y = 0.90;
	glow2.position.x -= 17;
	glow2.position.y += 143;
	glow2.alpha = 0;
	slider2.__z = 3000;
	stretch2.__z = 3000;
	glow2.__z = 4005;
	container.addChild(slider2);
	container.addChild(glow2);
	slider2.addChild(stretch2);

	var slider3 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupBarSlider.png']),
		stretch3 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupBarStretch.png']),
		glow3 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupGlow.png']);
	slider3.position.x += 0;
	slider3.position.y += 286;
	stretch3.position.x += 1;
	stretch3.position.y += 17;
	stretch3.scale.y = 0.90;
	glow3.position.x -= 17;
	glow3.position.y += 250;
	glow3.alpha = 0;
	slider3.__z = 3000;
	stretch3.__z = 3000;
	glow3.__z = 4005;
	container.addChild(slider3);
	container.addChild(glow3);
	slider3.addChild(stretch3);

	var slider4 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupBarSlider.png']),
		stretch4 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupBarStretch.png']),
		glow4 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupGlow.png']);
	slider4.position.x += 0;
	slider4.position.y += 402;
	stretch4.position.x += 1;
	stretch4.position.y += 17;
	stretch4.scale.y = 0.90;
	glow4.position.x -= 17;
	glow4.position.y += 374;
	glow4.alpha = 0;
	slider4.__z = 3000;
	stretch4.__z = 3000;
	glow4.__z = 4005;
	container.addChild(slider4);
	container.addChild(glow4);
	slider4.addChild(stretch4);

	var slider5 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupBarSlider.png']),
		stretch5 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupBarStretch.png']),
		glow5 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupGlow.png']);
	slider5.position.x += 0;
	slider5.position.y += 497;
	stretch5.position.x += 1;
	stretch5.position.y += 17;
	stretch5.scale.y = 0.90;
	glow5.position.x -= 17;
	glow5.position.y += 470;
	glow5.alpha = 0;
	slider5.__z = 3000;
	stretch5.__z = 3000;
	glow5.__z = 4005;
	container.addChild(slider5);
	container.addChild(glow5);
	slider5.addChild(stretch5);

	container.update = function () {
		// regen
		if (PowerupManager.powerupStates.minersRegen.timeLeft > 0 && slider1.position.x < 99 && !slider1.tweenedIn) {
			TweenLite.to(
				slider1.position,
				0.5,
				{
					x: 99,
					ease: Quad.easeOut
				}
			);
			TweenLite.to(
				glow1,
				0.5,
				{
					alpha: 1,
					ease: Quad.easeInOut
				}
			);
			slider1.tweenedIn = true;
			slider1.tweenedOut = false;
		} else if (PowerupManager.powerupStates.minersRegen.timeLeft < 0 && slider1.position.x > 0 && !slider1.tweenedOut){
			TweenLite.to(
				slider1.position,
				0.5,
				{
					x: 0,
					ease: Quad.easeIn
				}
			);
			TweenLite.to(
				glow1,
				0.5,
				{
					alpha: 0,
					ease: Quad.easeInOut
				}
			);
			slider1.tweenedIn = false;
			slider1.tweenedOut = true;
		} else {
			stretch1.scale.x = 81 / 600 * PowerupManager.powerupStates.minersRegen.timeLeft;
		}

		// miners shield
		if (PowerupManager.powerupStates.minersShield.timeLeft > 0 && slider2.position.x < 99 && !slider2.tweenedIn) {
			TweenLite.to(
				slider2.position,
				0.5,
				{
					x: 99,
					ease: Quad.easeOut
				}
			);
			TweenLite.to(
				glow2,
				0.5,
				{
					alpha: 1,
					ease: Quad.easeInOut
				}
			);
			slider2.tweenedIn = true;
			slider2.tweenedOut = false;
		} else if (PowerupManager.powerupStates.minersShield.timeLeft < 0 && slider2.position.x > 0 && !slider2.tweenedOut){
			TweenLite.to(
				slider2.position,
				0.5,
				{
					x: 0,
					ease: Quad.easeIn
				}
			);
			TweenLite.to(
				glow2,
				0.5,
				{
					alpha: 0,
					ease: Quad.easeInOut
				}
			);
			slider2.tweenedIn = false;
			slider2.tweenedOut = true;
		} else {
			stretch2.scale.x = 81 / 600 * PowerupManager.powerupStates.minersShield.timeLeft;
		}

		// extra miners
		if (PowerupManager.powerupStates.extraMiners.bool === true) {
			PowerupManager.powerupStates.extraMiners.bool = false;
			TweenLite.to(
				glow3,
				0.5,
				{
					alpha: 1,
					ease: Quad.easeInOut,
					onComplete: function () {
						TweenLite.to(
							glow3,
							0.5,
							{
								alpha: 0,
								ease: Quad.easeInOut,
							}
						);
					}
				}
			);
		}  

		// infinite stability
		if (PowerupManager.powerupStates.infiniteStability.timeLeft > 0 && slider4.position.x < 99 && !slider4.tweenedIn) {
			TweenLite.to(
				slider4.position,
				0.5,
				{
					x: 99,
					ease: Quad.easeOut
				}
			);
			TweenLite.to(
				glow4,
				0.5,
				{
					alpha: 1,
					ease: Quad.easeInOut
				}
			);
			slider4.tweenedIn = true;
			slider4.tweenedOut = false;
		} else if (PowerupManager.powerupStates.infiniteStability.timeLeft < 0 && slider4.position.x > 0 && !slider4.tweenedOut){
			TweenLite.to(
				slider4.position,
				0.5,
				{
					x: 0,
					ease: Quad.easeIn
				}
			);
			TweenLite.to(
				glow4,
				0.5,
				{
					alpha: 0,
					ease: Quad.easeInOut
				}
			);
			slider4.tweenedIn = false;
			slider4.tweenedOut = true;
		} else {
			stretch4.scale.x = 81 / 600 * PowerupManager.powerupStates.infiniteStability.timeLeft;
		}

		// damage increase
		if (PowerupManager.powerupStates.damageIncrease.timeLeft > 0 && slider5.position.x < 99 && !slider5.tweenedIn) {
			TweenLite.to(
				slider5.position,
				0.5,
				{
					x: 99,
					ease: Quad.easeOut
				}
			);
			TweenLite.to(
				glow5,
				0.5,
				{
					alpha: 1,
					ease: Quad.easeInOut
				}
			);
			slider5.tweenedIn = true;
			slider5.tweenedOut = false;
		} else if (PowerupManager.powerupStates.damageIncrease.timeLeft < 0 && slider5.position.x > 0 && !slider5.tweenedOut){
			TweenLite.to(
				slider5.position,
				0.5,
				{
					x: 0,
					ease: Quad.easeIn
				}
			);
			TweenLite.to(
				glow5,
				0.5,
				{
					alpha: 0,
					ease: Quad.easeInOut
				}
			);
			slider5.tweenedIn = false;
			slider5.tweenedOut = true;
		} else {
			stretch5.scale.x = 81 / 600 * PowerupManager.powerupStates.damageIncrease.timeLeft;
		}
	};

	return container;
};

var PowerupManager = (function () {
	var module = {
		existingPowerups: [],
		update: function (data) {
			var bounds1 = StateManager.getState().player.getBounds();
			for (var i = 0; i < this.existingPowerups.length; i++) {
				if (this.existingPowerups[i].active) {
					var bounds2 = this.existingPowerups[i].getBounds();

					var dx = bounds1.x - bounds2.x;
					var dy = bounds1.y - bounds2.y;

					var dist = Math.sqrt(dx*dx + dy*dy);
					if(dist < 32)
					{
						TweenLite.to(
							this.existingPowerups[i],
							0.5,
							{
								alpha: 0,
								rotation: 5
							}
						);

						switch (this.existingPowerups[i].type) {
							case 'damageIncrease':
								this.powerupStates.damageIncrease.timeLeft = 60 * 10;
							break;
							case 'extraMiners':
								this.powerupStates.extraMiners.bool = true;
								StateManager.getState().world.spawnExtraMiners(2);
							break;
							case 'minersShield':
								this.powerupStates.minersShield.timeLeft = 60 * 10;
							break;
							case 'minersRegen':
								this.powerupStates.minersRegen.timeLeft = 60 * 10;
							break;
							case 'infiniteStability':
								this.powerupStates.infiniteStability.timeLeft = 60 * 10;
							break;
						}

						this.existingPowerups[i].active = false;
					}
				}
			}

			if (Math.random()*1250 >= 1249) {
				var rnd = Math.floor(Math.random()*5),
					type,
					texture;
				switch (rnd) {
					case 0:
						type = 'damageIncrease';
						texture = PIXI.TextureCache[Utils.Assets.Images + 'level/sprDamageIncreased.png'];
					break;
					case 1:
						type = 'extraMiners';
						texture = PIXI.TextureCache[Utils.Assets.Images + 'level/sprExtraMiners.png'];
					break;
					case 2:
						type = 'minersShield';
						texture = PIXI.TextureCache[Utils.Assets.Images + 'level/sprMinersShield.png'];
					break;
					case 3:
						type = 'minersRegen';
						texture = PIXI.TextureCache[Utils.Assets.Images + 'level/sprRegenMiners.png'];
					break;
					case 4:
						type = 'infiniteStability';
						texture = PIXI.TextureCache[Utils.Assets.Images + 'level/sprStabilityShield.png'];
					break;
				}

				var powerup = new Powerup(type, texture);
				Game.PIXI.Camera.addChild(powerup);
				this.existingPowerups.push(powerup);
			}

			this.powerupStates.damageIncrease.timeLeft--;
			this.powerupStates.minersShield.timeLeft--;
			this.powerupStates.minersRegen.timeLeft--;
			this.powerupStates.infiniteStability.timeLeft--;
		},
		getPowerupState: function (powerup) {

		},
		powerupStates: {
			damageIncrease: {
				timeLeft: 0
			},
			extraMiners: {
				bool: false,
			},
			minersShield: {
				timeLeft: 0
			},
			minersRegen: {
				timeLeft: 0
			},
			infiniteStability: {
				timeLeft: 0
			}
		}
	};
	return module;
})();

var Powerup = function (type, powerupImg) {
	var sprite = new PIXI.Sprite(powerupImg);
	extend(this, sprite);
	this.type = type;
	this.pivot.x = 0.5;
	this.pivot.y = 0.5;
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.scale.x = 0.5;
	this.scale.y = 0.5;
	this.__z = 12443;
	var angle = Math.round(Math.random() * 360);
	this.position.x = Math.cos(angle * Math.PI / 180) * (StateManager.getState().player.collisionPoint + 75);
	this.position.y = Math.sin(angle * Math.PI / 180) * (StateManager.getState().player.collisionPoint + 75);
	this.active = true;
};