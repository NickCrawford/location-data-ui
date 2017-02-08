(function(){

	'use strict';

	angular
	.module('locationDataUi')
	.controller('MainController', MainController);

	function MainController($scope, $log, leafletDrawEvents, PointQueryService) {
		var drawnItems = new L.FeatureGroup();

		angular.extend($scope, {
			map: {
				porto: {
					lat: 41.1414,
					lng: -8.61864,
					zoom: 16
				},
				drawOptions: {
					position: "topleft",
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
			},
			startDate: new Date(Date.UTC(1970, 0, 1, 0, 0, 0)), //Normalize minus timezones
			endDate: new Date()
		});

		var handle = {
			created: function(e,leafletEvent, leafletObject, model, modelName) {
				drawnItems.addLayer(leafletEvent.layer);
				$log.log(e, leafletEvent, leafletObject, model, modelName);
				
				if (leafletEvent.layerType === 'circle') {
					$log.log($scope.startDate, $scope.endDate);
					var start = $scope.startDate.getTime();

					var end = $scope.endDate.getTime();
					
					$log.log(start, end);

					PointQueryService.circleQuery(leafletEvent.layer._latlng.lat, leafletEvent.layer._latlng.lng, leafletEvent.layer._mRadius, start, end)

					.then( function(result) {

						// for (var i = result.data.length - 1; i >= 0; i--) {

						// 	var coordinate = new L.LatLng(
						// 		result.data[i].loc.coordinates[1], // Latitude
						// 		result.data[i].loc.coordinates[0] //Longitude
						// 		);
							
						// 	var marker = new L.Marker(coordinate, {});
						// 	marker.addTo(leafletObject);
						// }

						// Get all trip ids in the resulting points
						var uniqueTrips = [20432];//result.data.map(function(point) {return point.TripID;}); // [20432]
						
						//remove duplicates
					    var seen = {};
					    var out = [];
					    var len = uniqueTrips.length;
					    var j = 0;
					    for(var i = 0; i < len; i++) {
					         var item = uniqueTrips[i];
					         if(seen[item] !== 1) {
					               seen[item] = 1;
					               out[j++] = item;
					         }
					    }
					    uniqueTrips = out.sort();

						//iterate through each unique trip id and find all lat and longs with that trip id
						var polyLines = [];

						for (var i = uniqueTrips.length - 1; i >= 0; i--) {
							var coords = result.data.filter(function(trip) {
								return trip.TripID === uniqueTrips[i];
							});
							console.log("coord", coords);

							var latlngs = coords.map(function(point) {
								return new L.LatLng(
									point.loc.coordinates[1], //Lat
									point.loc.coordinates[0] //Long
								);
							})
							var colors = ['purple', 'yellow', 'orange', 'brown', 'black', 'red'];

							var polyLine = new L.Polyline(latlngs, {
							    color: colors[i%6],
							    weight: 3,
							    opacity: 0.5,
							    smoothFactor: 1
						    });

							polyLines.push(polyLine);
						}

						console.log("unique", uniqueTrips);
						console.log("poly lines",polyLines);
						// var result = jsObjects.filter(function( obj ) {
						//   return obj.b == 6;
						// });

						/* **************************** */

						// var polyLines = [];

						// var curTrip = null;

						// var pl = [];

						// for (var i = result.data.length - 1; i >= 0; i--) {
						// 	if (curTrip == null) {
						// 		curTrip = result.data[i].TripID; 
						// 	}

						// 	if (result.data[i].TripID == curTrip) { 
						// 		var point = new L.LatLng(
						// 				result.data[i].loc.coordinates[1], //Lat
						// 				result.data[i].loc.coordinates[0] //Long
						// 			);
						// 		pl.push( point );
									
								
						// 	} else {
						// 		//$log.log(curTrip);
						// 		var pline = new L.Polyline(pl, {
						// 			    color: 'red',
						// 			    weight: 3,
						// 			    opacity: 0.5,
						// 			    smoothFactor: 1
						// 		    });
						// 		//$log.log(pline);
						// 		polyLines.push(pline);
						// 	    pl = [];
						// 	    var point = new L.LatLng(
						// 				result.data[i].loc.coordinates[1], //Lat
						// 				result.data[i].loc.coordinates[0] //Long
						// 			);
						// 		pl.push( point );
						// 	}
						// }

						for (var i = polyLines.length - 1; i >= 0; i--) {
							//$log.log(i);
							polyLines[i].addTo(leafletObject);
						}

						$log.log("Done Drawing");

					});
				} else if (leafletEvent.layerType === "rectangle") {
					PointQueryService.polyQuery(leafletEvent.layer._latlngs, start, end)

					.then( function(result) {

						for (var i = result.data.length - 1; i >= 0; i--) {

							var coordinate = new L.LatLng(
								result.data[i].loc.coordinates[1], // Latitude
								result.data[i].loc.coordinates[0] //Longitude
								);
							
							var marker = new L.Marker(coordinate, {});
							marker.addTo(leafletObject);
						}
					});
				}
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

}());