'use strict';
var BulletObject = require('../object/bullet');

var Manager = function(scene, game) {
	this.game = game;
	this.objects = [];
};
Manager.prototype.run = function() {
	for(var i = 0, len = this.objects.length; i < len; i++) {
		this.objects[i].run();
	}
};
Manager.prototype.updateDisplay = function() {
	for(var i = 0, len = this.objects.length; i < len; i++) {
		this.objects[i].updateDisplay();
	}
};
Manager.prototype.create = function(x, y, r, theta, sprite_x, sprite_y) {
	this.objects.push(new BulletObject(this.game, x, y, r, theta, sprite_x, sprite_y));
};
module.exports = Manager;
