require(
	[
		"animationmanager.js",
		"level/world.js", 
		"level/player.js",
		"level/enemy.js",
		"level/miner.js",
		"level/healthbar.js",
		"gameobject.js",
		"level/cameracontroller.js",
		"level/ui.js",
		"level/particlesystem.js",
		"level/overlay.js",
		"level/powerup.js"
	], main);

function main()
{
	music = new Audio('././assets/sounds/sndMusic.mp3');
	music.addEventListener("ended", function () {
		music.play();
	});
	music.play();
    StateManager.addState({
    	timer: 0,
    	stability: 100,
    	maxStability: 100,
    	world: null,
    	player: null,
    	enemies: [],
    	miners: [],
    	ui: null,
		name: "level",
		gameOver: false,

		initialise: function() {
			this.player = null;
			this.world = null;
			this.enemies = [];
			this.miners = [];
			this.ui = null;
			this.gameOver = false;
    		this.hotspotMiners = Math.random() * 90;
    		this.hotspotEnemies = Math.random() * 90 + 180;
    		this.redOverlay = new Overlay();
    		this.player = new Player(Math.random() * 360, this.world);
    		this.ui = new UI(this.maxStability);
			this.world = new World();
			this.powerupBar = new PowerupBar();
			this.sorted = false;

			var Filter = function()
			{
				PIXI.AbstractFilter.call( this );
 
			    this.passes = [this];
			 
			    // set the uniforms
			    this.uniforms = {
			    	exposure: {type: '1f', value: -0.35},
			    	saturation: {type: '1f', value: -0.35}
			    };
			 
			 
			    this.fragmentSrc = [
			        'precision mediump float;',
			        'varying vec2 vTextureCoord;',
			        'varying vec4 vColor;',
			        'uniform float exposure;',
			        'uniform float saturation;',
			        'uniform sampler2D uSampler;',
			 
			        'void main(void) {',
			        '   gl_FragColor = texture2D(uSampler, vTextureCoord);',
			        '   vec3 result = clamp(gl_FragColor.rgb - exposure*(gl_FragColor.rgb), 0.0, 1.0);',
			        '   gl_FragColor.rgba = vec4(gl_FragColor.r,gl_FragColor.g,gl_FragColor.b,gl_FragColor.a)*exposure;',
			        '   gl_FragColor.rgb = mix(gl_FragColor.rgb,result.rgb,1.0);',
			        '	vec3 grayXfer = vec3(0.3, 0.59, 0.11);',
					'	vec3 gray = vec3(dot(grayXfer, gl_FragColor.rgb));',
					'	gl_FragColor.rgba = vec4(mix(gl_FragColor.rgb, gray, saturation), 1.0);',
			        '}'
			    ];
			}

			Filter.prototype = Object.create( PIXI.AbstractFilter.prototype );
			Filter.prototype.constructor = PIXI.Filter;

			var filters = [];
			filters.push(new Filter());

			Game.PIXI.Camera.filters = filters;
			Game.PIXI.Camera.addChild(this.world.clouds);
		},
		update: function(data) {
			if(!this.sorted)
			{
				Game.sort();
				this.sorted = true;
			}
			PowerupManager.update(data);
			this.player.update(data);
			this.timer+=0.01;
			this.redOverlay.update(data);

			for (var i = 0; i < this.miners.length; ++i) {
				this.miners[i].update(data);
			}

			for (var i = 0; i < this.enemies.length; ++i) {
				this.enemies[i].update(data);
			}
			this.ui.update(data);
			this.world.update(data);
		},
		destroy: function() {
			Game.PIXI.Camera.children = [];
		}
	});

	StateManager.switchState("level");
}