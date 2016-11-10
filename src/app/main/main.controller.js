'use strict';

angular
.module('locationDataUi')
.controller('MainController', MainController);

function MainController($scope, leafletDrawEvents) {
	var drawnItems = new L.FeatureGroup();
	
	angular.extend($scope, {
		map: {
			porto: {
					lat: 41.1414,
					lng: -8.61864,
					zoom: 12
			},
			drawOptions: {
				position: "topright",
				draw: {
					polyline: {
						metric: false
					},
					polygon: {
						metric: false,
						showArea: true,
						drawError: {
							color: '#b00b00',
							timeout: 1000
						},
						shapeOptions: {
							color: 'blue'
						}
					},
					circle: {
						showArea: true,
						metric: false,
						shapeOptions: {
							color: '#662d91'
						}
					},
					marker: false
				},
				edit: {
					featureGroup: drawnItems,
					remove: true
				}
			}
		}
	});

	var handle = {
		created: function(e,leafletEvent, leafletObject, model, modelName) {
			drawnItems.addLayer(leafletEvent.layer);
			console.log(e, leafletEvent, leafletObject,model, modelName);
		},
		edited: function(arg) {},
		deleted: function(arg) {
			var layers;
			layers = arg.layers;
			drawnItems.removeLayer(layer);
		},
		drawstart: function(arg) {},
		drawstop: function(arg) {
			
		},
		editstart: function(arg) {},
		editstop: function(arg) {},
		deletestart: function(arg) {},
		deletestop: function(arg) {}
	};

	var drawEvents = leafletDrawEvents.getAvailableEvents();
	drawEvents.forEach(function(eventName){
		$scope.$on('leafletDirectiveDraw.' + eventName, function(e, payload) {
			//{leafletEvent, leafletObject, model, modelName} = payload
			var leafletEvent, leafletObject, model, modelName; //destructuring not supported by chrome yet :(
			leafletEvent = payload.leafletEvent, leafletObject = payload.leafletObject, model = payload.model,
			modelName = payload.modelName;
			handle[eventName.replace('draw:','')](e,leafletEvent, leafletObject, model, modelName);
		});
	});
};