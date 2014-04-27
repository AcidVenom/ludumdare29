/* 
 * @name Core
 * @description This is used as a main entry point for the code and also
 * to prevent a cluttered index file because of many script includes
 * @author Riko Ophorst
 */
(function (window, document) {
	window.addEventListener('load', function () {
		var tags = [],
			/*
			 * Note: Order of scripts array DOES matter;
			 * First entry gets loaded first, second gets
			 * loaded second, etc.
			 */
			scripts = [
				'./src/js/game.js',
				'./src/js/stats.js',
				'./src/js/utils.js',
				'./src/js/assets.js',
				'./src/js/statemanager.js',
				'./src/js/input.js',
				'./src/js/gameobject.js'
				'./src/js/main.js'
			],
			loadScript = function (i) {
				var scriptTag = document.createElement('script');
				scriptTag.src = scripts[i] ? scripts[i] : undefined;
				scriptTag.addEventListener('load', function () {
					if (scripts[++i] !== undefined) {
						loadScript(i);
					} else {
						Game.initialise();
					}
				});
				document.head.appendChild(scriptTag);
				tags.push(scriptTag);
			};
		loadScript(0);
	});
})(window, document);

/// Requires a given JavaScript file
function require(paths, cb)
{   
	var loaded = 0;
	for (var i = 0; i < paths.length; i++) {
		var scriptTag = document.createElement('script');
	   
		scriptTag.src = './src/js/' + paths[i];
		
		scriptTag.addEventListener('load', function () {
			if(cb && ++loaded >= paths.length)
			{
				cb();
			}
		});

		document.head.appendChild(scriptTag);
	}
}

function extend (obj, obj2, bool) {
	for (var prop in obj2) {
		if (obj[prop] !== undefined || !bool) {
			obj[prop] = obj2[prop];
		} else {
			if (obj['base'] === undefined) {
				obj['base'] = {};
			}

			if (obj['base'][prop] === undefined) {
				obj['base'][prop] = [];
			}

			obj['base'][prop].push(obj[prop]);
		}
	}
}