'use strict';

var Camera = function(game, position) {
	this.game = game;
	this.position = position
	this.viewportWidth = 512;
	this.viewportHeight = 512;
	this.minimumDistanceX = 0;
	this.minimumDistanceY = 0;
	this.followObject = null;
	/**
	 * @property {Boundary} viewportBoundary - The boundary that represents the viewport
	 */
	this.viewportBoundary = new Boundary(
		// this.position.x * (game.settings.tileSize * this.game.settings.zoom),
		// this.position.y * (game.settings.tileSize * this.game.settings.zoom),
        this.position.x * (16 * 2),
		this.position.y * (16 * 2),
		this.viewportWidth,
		this.viewportHeight
	);
	/**
	 * @property {Boundary} mapBoundary - The boundary that represents the viewport
	 */
	this.mapBoundary = new Boundary(
		0,
		0,
		// game.settings.tilesX * (game.settings.tileSize * this.game.settings.zoom),
		// game.settings.tilesY * (game.settings.tileSize * this.game.settings.zoom)
        10 * 16 * 2,
        10 * 16 * 2
	);
};

Camera.prototype = {
	/**
	 * Function to call when you want to follow a specific entity
	 * @protected
	 *
	 * @param {Entity} followEntity - The entity that should be followed by the camera, this entity is required to have the position component
	 * @param {Number} minimumDistanceX - The minimal distance from horizontal borders before the camera starts to move
	 * @param {Number} minimumDistanceY - The minimal distance from vertical borders before the camera starts to move
	 */
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
            var tileSize = 1 * 2;
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
