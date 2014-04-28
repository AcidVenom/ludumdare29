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
		stretch1 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupBarStretch.png']);
	slider1.position.x += 99;
	slider1.position.y += 80;
	stretch1.position.x +=
	slider1.__z = 3000;
	stretch1.__z = 3000;
	container.addChild(slider1);
	slider1.addChild(stretch1);

	var slider2 = new PIXI.DisplayObjectContainer();

	var slider3 = new PIXI.DisplayObjectContainer();

	var slider4 = new PIXI.DisplayObjectContainer();

	var slider5 = new PIXI.DisplayObjectContainer();

	this.update = function () {
	};

	return container;
};

var PowerupManager = (function () {
	var module = {
		existingPowerups: [],
		update: function (data) {
			var bounds1 = StateManager.getState().player.getBounds();
			for (var i = 0; i < this.existingPowerups.length; i++) {
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
				}
			}

			if (Math.random()*500 >= 498) {
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
						type = 'minerRegen';
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
			this.powerupStates.minerRegen.timeLeft--;
			this.powerupStates.infiniteStability.timeLeft--;
		},
		getPowerupState: function (powerup) {

		},
		powerupStates: {
			damageIncrease: {
				timeLeft: 0
			},
			extraMiners: {},
			minersShield: {
				timeLeft: 0
			},
			minerRegen: {
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
};