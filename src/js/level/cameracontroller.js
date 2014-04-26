var CameraController = {
	__camera: Game.PIXI.Camera,
	shake: function (magnitude, duration, iterations, cb) {
		var count = 0,
			tween = function () {
				TweenLite.to(
					CameraController.__camera.position,
					duration,
					{
						x: CameraController.__camera.position.x - (magnitude / 2) + (Math.random() * magnitude),
						y: CameraController.__camera.position.y - (magnitude / 2) + (Math.random() * magnitude),
						onComplete: function () {
							if (++count !== iterations) {
								tween();
							} else {
								if (cb) {
									cb();
								}
							}
						}
					}
				);
			};
		tween();
	}
};