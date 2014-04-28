var AnimationManager = function () {
    return { 
        __states: {
            PLAYING: 'playing',
            STOPPED: 'stopped',
            PAUSED: 'paused',
        },
        __anims: {},
        __currentAnimation: null,
        __createFrames: function (frameData) {
            var frames = [];
            if (Sugar.isArray(frameData)) {
                for (var i = 0; i < frameData.length; i++) {
                    var newFrame = new PIXI.Texture(this.mainSprite.texture, {
                        x: frameData[i].x,
                        y: frameData[i].y,
                        width: frameData[i].width,
                        height: frameData[i].height
                    });
                    newFrame.timeShown = 0;
                    frames.push(newFrame);
                }
            }
            return frames;
        },
        add: function (name, animData) {
            if (!name || !animData || !Sugar.isObject(animData) || !(this.mainSprite.texture instanceof PIXI.Texture)) {
                throw 'AnimationManager.add(): Incorrect name or animData given as arguments, or no texture is set'
            } else {
                var newAnimation = {
                    currentFrame: null,
                    currentFrameId: 0,
                    frames: [],
                    state: this.__states.STOPPED,
                    frameRate: animData.frameRate ? animData.frameRate : 0.16,
                    reversed: animData.reversed ? animData.reversed : false,
                    cb: animData.cb ? animData.cb : undefined
                };
                newAnimation.frames = this.__createFrames(animData.frames);
                this.__anims[name] = newAnimation; 
            }
        },
        play: function (name) {
            if (!this.__anims[name]) {
                throw 'AnimationManager.play(): No animation found that corresponds to ' + name
            } else {
                if (this.__currentAnimation != null) {
                    this.stop();
                }
                var anim = this.__anims[name];
                anim.state = this.__states.PLAYING;
                anim.currentFrameId = anim.reversed ? anim.frames.length - 1 : 0;
                anim.currentFrame = anim.frames[anim.currentFrameId];
                this.__currentAnimation = anim;
            }
        },
        stop: function () {
            if (this.__currentAnimation != null) {
                var anim = this.__currentAnimation;
                anim.currentFrame.timeShown = 0;
                anim.currentFrameId = anim.reversed ? anim.frames.length - 1 : 0;
                anim.currentFrame = anim.frames[anim.currentFrameId];
                anim.state = this.__states.STOPPED;
                this.__currentAnimation = null;
            }
        },
        pause: function (name) {
            if (this.__currentAnimation != null) {
                var anim = this.__anims[name];
                anim.state = this.__states.PAUSED;
                this.mainSprite.setTexture(anim.currentFrame ? anim.currentFrame : anim.frames[0]);
            }
        },
        resume: function (name) {
            if (this.__currentAnimation != null)
            {
                this.__anims[name].state = this.__states.PLAYING;
            }
        },
        setFramerate: function (name,rate) {
            this.__anims[name].frameRate = rate;
        },
        setAnimation: function (name) {
            if (this.__currentAnimation != this.__anims[name])
            {
                this.play(name);
            }
        },
        update: function (data) {
            if (this.__currentAnimation != null) {
                var anim = this.__currentAnimation;

                if (anim.state == this.__states.PLAYING)
                {
                    anim.currentFrame.timeShown += data.dt*StateManager.getState().world.timeScale;
                    
                    if (anim.currentFrame.timeShown >= anim.frameRate) {
                        if (!anim.reversed) {
                            anim.currentFrame.timeShown = 0;
                            if (++anim.currentFrameId < anim.frames.length) {
                                anim.currentFrame = anim.frames[anim.currentFrameId];
                            } else {
                                if(anim.cb)
                                {
                                    anim.cb();
                                }
                                anim.currentFrameId = 0;
                                anim.currentFrame = anim.frames[0];
                            }
                            this.mainSprite.setTexture(anim.currentFrame);
                        } else {
                            anim.currentFrame.timeShown = 0;
                            if (--anim.currentFrameId >= 0) {
                                anim.currentFrame = anim.frames[anim.currentFrameId];
                            } else {
                                if(anim.cb)
                                {
                                    anim.cb();
                                }
                                anim.currentFrameId = anim.frames.length - 1;
                                anim.currentFrame = anim.frames[anim.frames.length - 1];
                            }
                            this.mainSprite.setTexture(anim.currentFrame);
                        }
                    }
                }
            }
        }
    }
};

/*this.animations.add('idle', {
    frameRate: 10,
    frames: [{
        x: 0,
        y: 0,
        width: 10,
        height: 10
    }],
    loop: true,
    reversed: true,
});*/