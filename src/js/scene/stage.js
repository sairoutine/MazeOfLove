'use strict';
var Boss = require('../object/boss');
var BulletManager = require('../manager/bullet');

var Scene = function(game) {
	this.game = game;

	this.boss = new Boss(this, game);
	this.bulletmanager = new BulletManager(this, game);
};
Scene.prototype.EXTRA_OUT_OF_STAGE_SIZE = 100;

Scene.prototype.run = function() {
	this.boss.run();
	this.bulletmanager.run();
};
Scene.prototype.updateDisplay = function() {
	this._showBackground();

	this.boss.updateDisplay();
	this.bulletmanager.updateDisplay();
};
Scene.prototype._showBackground = function() {
	this.game.surface.save();
	this.game.surface.fillStyle = "rgb(0, 0, 0)";
	this.game.surface.fillRect(0, 0, this.game.width, this.game.height);
	this.game.surface.restore();
};

Scene.prototype.isOutOfStage = function(object) {
	var x = object.x;
	var y = object.y;

	if(x + this.EXTRA_OUT_OF_STAGE_SIZE < 0 ||
	   y + this.EXTRA_OUT_OF_STAGE_SIZE < 0 ||
	   x > this.game.width  + this.EXTRA_OUT_OF_STAGE_SIZE ||
	   y > this.game.height + this.EXTRA_OUT_OF_STAGE_SIZE
	  ) {
		return true;
	}

	return false;
};

module.exports = Scene;
