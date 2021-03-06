'use strict';
var BulletObject = require('../object/bullet');

var Manager = function(scene, game) {
	this.game = game;
	this.scene = scene;
	this.objects = [];
};
Manager.prototype.run = function() {
	for(var i = 0, len = this.objects.length; i < len; i++) {
		this.objects[i].run();
	}

	this.removeOutOfStageObjects();
};
Manager.prototype.updateDisplay = function() {
	for(var i = 0, len = this.objects.length; i < len; i++) {
		this.objects[i].updateDisplay();
	}
};
Manager.prototype.create = function(x, y, r, theta, sprite_x, sprite_y) {
	this.objects.push(new BulletObject(this.game, x, y, r, theta, sprite_x, sprite_y));
};
Manager.prototype.remove = function(i) {
	this.objects.splice(i, 1);

};
Manager.prototype.removeOutOfStageObjects = function() {
	for(var i = 0; i < this.objects.length; i++) {
		if(this.scene.isOutOfStage(this.objects[i])) {
			this.remove(i);
		}
	}
};


module.exports = Manager;
