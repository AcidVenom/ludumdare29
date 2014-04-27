var ParticleSystem = function () {
	var module = {
		__emitters: [],
		createEmitter: function (settings) {
			var emitter = new Emitter(settings);
			this.__emitters.push(emitter);
			return emitter;
		},
		removeEmitter: function (emitter) {
			for (var i = 0; i < this.__emitters.length; i++) {
				if (this.__emitters[i] === emitter) {
					//this.__emitters[i].destroy();
					this.__emitters.splice(i, 1);
					return true;
				}
			}
			return false;
		},
		update: function (data) {
			var emitters = this.__emitters.slice();
			for (var i = 0, i2 = 0; i < emitters.length; i++) {
				i2++;
				if (this.__emitters[i].update(data) !== true) {
					i2--;
					this.__emitters[i2].destroy();
					this.__emitters.splice(i2, 1);
				}
			}
		},
		destroy: function () {
			var emitters = this.__emitters.slice();
			for (var i = 0; i < emitters.length; i++) {
				emitters[i].destroy();
			}
			this.__emitters = [];
		}
	};
	return module;		
};

var Emitter = function (settings) {
	var particle,
		currentParticles = [],
		onParticleUpdate,
		onEmitterUpdate,
		particle,
		container = new PIXI.DisplayObjectContainer(settings.x, settings.y, settings.__z),
		initialise = function () {
			onParticleUpdate = settings.onParticleUpdate || function () {};
			onEmitterUpdate = settings.onEmitterUpdate || function () {};
			particle = settings.texture;

			for (var i = 0; i < settings.instantEmitSize; i++) {
				var newParticle = new Particle(particle, settings);
				currentParticles.push(newParticle);
				container.addChild(newParticle);
			}

			if (settings.onEmitterInitialization) {
				settings.onEmitterInitialization();
			}
		};

	this.time = 0;

	this.update = function (data) {
		for (var i = 0; i < currentParticles.length; i++) {
			currentParticles[i].update(data);

			if (currentParticles[i].lifetime <= 0 && currentParticles[i].active) {
				currentParticles[i].active = false;
				container.removeChild(currentParticles[i]);
			}
		}

		this.time += data.dt;
		if (this.time >= settings.emitInterval) {
			this.time = 0;

			for (var i = 0; i < settings.emitSize; i++) {
				var newParticle = new Particle(particle, settings);
				currentParticles.push(newParticle);
				container.addChild(newParticle);
			}
		}

		onEmitterUpdate();
		return true;
	};

	container.__z = settings.__z || 0;
	extend(this, container);
	settings.parent.addChild(this);

	initialise();
};

var Particle = function (texture, settings) {
	var sprite = new PIXI.Sprite(texture);
	extend(this, sprite);
	this.lifetime = settings.lifetime;
	this.active = true;
	this.update = function (data) {
		this.lifetime--;
		if (settings.onParticleUpdate) {
			settings.onParticleUpdate(this, data);
		}

		return true;
	};


	if (settings.onParticleInitialization) {
		settings.onParticleInitialization(this);
	}
};