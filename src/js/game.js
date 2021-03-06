/*
 * @name Game
 * @description The main game logic happens here, i.e. update,
 * draw, managing game objects, etc
 * @author Riko Ophorst
 */
var Game = {
    _objects: [],
    _objectsQueue: [],
    _initialized: false,
    _timeLastFrame: 0,
    __scale: {
        x: 1,
        y: 1
    },
    AUTOSORT: true,
    initialise: function () {
        Game.PIXI = {
            Stage: new PIXI.Stage(0x000000, true),
            Renderer: PIXI.autoDetectRenderer(
                1280,
                720,
                document.getElementById("canvas")
            ),
            Camera: new PIXI.DisplayObjectContainer(),
            Loader: new PIXI.AssetLoader(Game.Assets.AssetList)
        };

        var progressBar = document.getElementById("progressBar");
        var loaded = 0;

        Game.PIXI.Loader.addEventListener('onProgress', function () {
            loaded++;
            progressBar.value = String(loaded);
            progressBar.max = String(Utils.Assets.Images.length);
        });

        Game.PIXI.Loader.addEventListener('onComplete', function () {
            Game._initialized = true;

            for (var i = 0; i < Game._objectsQueue.length; i++) {
                Game._objects.push(Game._objectsQueue[i]);
                if (Sugar.isFunction(Game._objectsQueue[i].init)) {
                    Game._objectsQueue[i].init();
                }
            }
            Game._objectsQueue = [];

            Game.sort();

            extend(Game.PIXI.Camera, GameObject());
            Game.PIXI.Camera.setZ(450);
            Game.PIXI.Stage.addChild(Game.PIXI.Camera);
            document.getElementById("progressDiv").style.display = "none";
            document.getElementById("canvas").style.display = "block";

            requestAnimationFrame(Game.update);
        });

        Game.PIXI.Loader.load();

        Game.PIXI.Camera.position.x = Game.PIXI.Renderer.width/2;
        Game.PIXI.Camera.position.y = Game.PIXI.Renderer.height/2;

        window.addEventListener('resize', Game.resizeGame, false);
        window.addEventListener('orientationchange', Game.resizeGame, false);

        Game.resizeGame();
    },
    update: function (time) {
        // Start the tick
        Game.Stats.begin();

        var data = {
            dt: (time - Game._timeLastFrame) / 100,
            gameTime: Game._gameTime = Game._gameTime + this.dt
        };
        Game._timeLastFrame = time;

        if(StateManager.getState() != null) {
            StateManager.updateState(data);
        }

        // Rendering
        Game.PIXI.Renderer.render(Game.PIXI.Stage);

        // Request next animation frame
        requestAnimationFrame(Game.update);

        // End the tick
        Game.Stats.end();
    },
    sort: function () {
        if (Game._initialized) {
            var doSort = function (obj) {
                if (obj.children) {
                    obj.children.sort(function (a, b) {

                        if(a.__z === undefined)
                        {
                            console.error("Could not find Z index for: ", a);
                        }

                        if(b.__z === undefined)
                        {
                            console.error("Could not find Z index for: ", b);
                        }
                        return a.__z - b.__z;
                    });

                    for (var i = 0; i < obj.children.length; i++) {
                        doSort(obj.children[i]);
                    }
                }
            };
            doSort(Game.PIXI.Stage);
        }
    },
    resizeGame: function () {
        var canvas = document.getElementById("canvas"),
            canvasRatio = canvas.height / canvas.width,
            windowRatio = window.innerHeight / window.innerWidth,
            width,
            height;

        if (windowRatio < canvasRatio) {
            height = window.innerHeight;
            width = height / canvasRatio;
        } else {
            width = window.innerWidth;
            height = width * canvasRatio;
        }

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        var maxWidth = Game.PIXI.Renderer.width,
            maxHeight = Game.PIXI.Renderer.height,
            scale = {
                x: maxWidth / width, 
                y: maxHeight / height
            };
        Game.__scale = scale;
    },
    getScale: function() {
        return this.__scale;
    }
};