(function(){

    'use strict';

    angular
    .module('locationDataUi')
    .controller('MainController', MainController);

    function MainController($scope, leafletDrawEvents, MapQueryService) {

        var drawnItems = new L.FeatureGroup();

        angular.extend($scope, {
        	combineClusters: true,
        	selectedClusters: [],
            map: {
                tweets: {
                    lat: 41.0814,
                    lng: -81.5190,
                    zoom: 12
                },

/*              legend: {
                    position: "bottomright",
                    colors: [ '#FF0000', '#FF8800', '#FF0000', '#FF0000', '#FF0000'],
                    labels: [ '1000', '500', '200', '100', '50' ]
                },*/

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
                                color: '#662d91',
                                clickable: true
                            }
                        },
                        marker: true
                    },
                    edit: {
                        featureGroup: drawnItems,
                        remove: true
                    }
                }
            }
        });

        function parseDate(input) {
        	return Date.parse(input)/1000; 
        }


        var handle = {
            created: function(e,leafletEvent, leafletObject, model, modelName) {
                drawnItems.addLayer(leafletEvent.layer);
                console.log(e, leafletEvent, leafletObject, model, modelName);
                //var legend = L.control({position: 'bottomright'});
                var datefrom = parseDate(document.getElementById('datefrom').value);
                var dateto = parseDate(document.getElementById('dateto').value);
                if (leafletEvent.layerType === 'circle') {
                    MapQueryService.circleQuery(leafletEvent.layer._latlng.lat, leafletEvent.layer._latlng.lng, leafletEvent.layer._mRadius)
                    .then(function(result) {
                    	if (result.status == "200") {
                    		console.log("Query Successful");
                    		drawClusters(result.data);
                    	} else {
                    		console.log(result.status + " error", result.statusText)
                    	}
                    });
                } else if (leafletEvent.layerType === "rectangle" || leafletEvent.layerType === "polygon") {
					MapQueryService.polyQuery(leafletEvent.layer._latlngs, datefrom, dateto)

					.then( function(result) {
                    	if (result.status == "200") {
                    		console.log("Query Successful");
                    		drawClusters(result.data);
                    	} else {
                    		console.log(result.status + " error", result.statusText)
                    	}
					});
				}


				// Draws clusters after a result has been returned from the server
		        function drawClusters(result) {
					//Draw Here
					//console.log(result);

					var filterBytimeResult = [];

					for (var i=0; i<result.length; i++){
						var datefromdata = parseDate(result[i].created_at);
						if (dateto > datefromdata && datefrom < datefromdata)  {
							filterBytimeResult.push(result[i]);
						}
					}           
					//console.log(filterBytimeResult.length);

					if (document.getElementById('datefrom').value === "" || document.getElementById('dateto').value === "") {

						/* This part is not have date filter*/

						var cluster = L.markerClusterGroup();
						cluster.options.zoomToBoundsOnClick = false;

						var groupMarker = L.layerGroup();


						for (var i = result.length - 1; i >= 0; i--) {
							var myIcon = L.icon({
								iconUrl: '/images/points.png',
								iconSize: [10, 10],
								iconAnchor: [10, 10]
							});

							var markers = L.marker([result[i].loc.coordinates[1], result[i].loc.coordinates[0]], {icon: myIcon});//.bindPopup(result[i].keywords.toString()).openPopup();
							cluster.addLayer(markers);

							groupMarker.addLayer(markers);
							//document.write(result[i].keywords);
							//console.log(cluster);
						}

						if (result.length > 500) {

							leafletObject.addLayer(cluster);

							cluster.on('clusterclick', function (a) {
						// a.layer is actually a cluster
						//console.log(a.layer.getAllChildMarkers());

						if ($scope.combineClusters) {

							console.log("combining:", a.layer);

						// a.layer.selected = true;
						// Add selected class to target
						angular.element(a.layer._icon).addClass("marker-selected");

						if (selectedClusters.length > 0) {
						//Add selected class to children
						var clickCluster = a.layer.getAllChildMarkers();

						for (i = 0; i < clickCluster.length; i++) {
						//markerIn.push(clickCluster[i]._latlng.lat);
						console.log(clickCluster[i]);
						//clickCluster[i].selected = true;
						}
						}

						$scope.selectedClusters.push(a.layer);

						var mySubGroup = L.featureGroup.subGroup(parentGroup, arrayOfMarkers);
						}

						var clickCluster = a.layer.getAllChildMarkers();
						var markerIn = [];

						for (i = 0; i < clickCluster.length; i++) {
						//markerIn.push(clickCluster[i]._latlng.lat);
						markerIn.push(clickCluster[i]._popup._content);
						}

						console.log(markerIn);
						}); // end of 'on cluster click'

						} else { //If result size is less than 500

							leafletObject.addLayer(groupMarker);
						}

						} else {

							/* This part have date filter*/


							var cluster = L.markerClusterGroup();
							var groupMarker = L.layerGroup();

							for (var i = filterBytimeResult.length - 1; i >= 0; i--) {
								var myIcon = L.icon({
									iconUrl: '/images/points.png',
									iconSize: [10, 10],
									iconAnchor: [10, 10]
								});
								var markers = new L.marker([filterBytimeResult[i].loc.coordinates[1], filterBytimeResult[i].loc.coordinates[0]], {icon: myIcon});

								cluster.addLayer(markers);

								groupMarker.addLayer(markers);
						//document.write(result[i].keywords);
						//console.log(result[i].keywords);

						}

						if (filterBytimeResult.length > 500) {
							leafletObject.addLayer(cluster);
						} else {
							leafletObject.addLayer(groupMarker);
						}
					}   
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