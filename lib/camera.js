'use strict';

var Camera = function(game, position) {
	this.game = game;
	this.position = position
	this.viewportWidth = window.innerWidth;
	this.viewportHeight = window.innerHeight;
	this.minimumDistanceX = 0;
	this.minimumDistanceY = 0;
	this.followObject = null;
};
Camera.prototype = {
	follow: function(followEntity, minimumDistanceX, minimumDistanceY) {

		//Set the follow object to be the object that's passed along
		//Object needs to have a position component, containing an
		//X and an Y value, in tiles
		this.followObject = followEntity.position;
		//Set the minimum distance from the borders of the map
		this.minimumDistanceX = 0;
		this.minimumDistanceY = 0;
	},
	update: function() {
		//Check if the camera even has to move
		if(this.followObject !== null) {
			// Define the variables needed for moving the camera
			// var tileSize = this.game.map.settings.tileSize * this.game.settings.zoom;
            var tileSize = 1 * 3;
			//Calculate the center position of the object that we are following

            var followCenterX = (this.followObject.x * tileSize) + (tileSize / 2);
			var followCenterY = (this.followObject.y * tileSize) + (tileSize / 2);

            this.position.x = followCenterX - this.viewportWidth/2;
            this.position.y = followCenterY - this.viewportHeight/2;
		}
	}

};
if(typeof module !== "undefined"){
  module.exports = Came;
}
