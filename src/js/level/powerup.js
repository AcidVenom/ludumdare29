var PowerupBar = function () {
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprPowerupBar.png']);
	sprite.position.x = Game.PIXI.Camera.position.x - 640;
	sprite.position.y = Game.PIXI.Camera.position.y - 320;
	sprite.__z = 4000;

	Game.PIXI.Stage.addChild(sprite);
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

						break;
						case 'minersRegen':

						break;
						case 'infiniteStability':
						
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