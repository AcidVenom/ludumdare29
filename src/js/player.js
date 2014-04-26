var Player = function(x, y, cx, cy) 
{
    var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'dragon.png']),
        speed = 250,
        i = 0,
        text = new PIXI.Text('Draakje', Utils.Text.Big),
        container = new PIXI.DisplayObjectContainer();

    this.animations = {};

    extend(this, sprite);
    extend(this, GameObject);
    extend(this.animations, AnimationManager);

    this.position.x = 20;
    this.position.y = 20;
    this.pivot.x = 0.5;
    this.pivot.y = 0.5;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    text.position.x = this.position.x;
    text.position.y = this.position.y - 70;
    text.anchor.x = 0.5;

    this.animations.mainSprite = this;
    this.animations.add('idle', {
        frameRate: 0.1,
        frames: [{
            x: 0,
            y: 0,
            width: 100,
            height: 100
        },{
            x: 100,
            y: 0,
            width: 100,
            height: 100
        },{
            x: 200,
            y: 0,
            width: 100,
            height: 100
        },{
            x: 300,
            y: 0,
            width: 100,
            height: 100
        }],
        loop: true,
        reversed: false
    });
    this.animations.play('idle');
    function tween () {
        TweenLite.to(
            text.position,
            0.16,
            {
                y: text.position.y === -53 ? -49 : -53,
                easing: Linear.easeInOut,
                onComplete: function () { tween(); }
            }
        );
    }
    // MLG LEGIT 360 NOSCOPE TRICKSHOT BELLYFLIP STYLE CODE INCOMING
    this.update = function (data) {
        this.animations.update(data);

        var pressed = 0,
            moved = {
                x: 0,
                y: 0,
            };

        if (Input.isDown('down')) {
            pressed++;
            moved.y += 250 * data.dt;
        }

        if (Input.isDown('up')) {
            pressed++;
            moved.y -= 250 * data.dt;
        }

        if (Input.isDown('right')) {
            pressed++;
            moved.x += 250 * data.dt;
        }

        if (Input.isDown('left')) {
            pressed++;
            moved.x -= 250 * data.dt;
        }

        if (pressed > 1) {
            moved.x *= 0.75;
            moved.y *= 0.75;
        }

        if (moved.x > 0) {
            this.scale.x = 0.4;
        } else if (moved.x < 0) {
            this.scale.x = -0.4;
        }

        container.position.x += moved.x;
        container.position.y += moved.y;

        this.scale.y = 0.4;
    }

    tween();
    container.addChild(this);
    container.addChild(text);
    Game.PIXI.Stage.addChild(container);
}