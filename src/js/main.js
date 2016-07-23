'use strict';
var Game = require('./game');

window.onload = function() {
	// Canvas
	var mainCanvas = document.getElementById('mainCanvas');

	var game = new Game(mainCanvas);
	game.init();
	game.run();
};
