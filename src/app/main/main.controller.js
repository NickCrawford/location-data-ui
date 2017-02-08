(function(){

    'use strict';

    angular
    .module('locationDataUi')
    .controller('MainController', MainController);

    function MainController($scope, leafletDrawEvents, MapQueryService) {

        var drawnItems = new L.FeatureGroup();

        angular.extend($scope, {
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
                if (leafletEvent.layerType === 'circle') {
                    MapQueryService.circleQuery(leafletEvent.layer._latlng.lat, leafletEvent.layer._latlng.lng, leafletEvent.layer._mRadius)
                    .then(function(result) {
                        //Draw Here
                        //console.log(result);

                        var filterBytimeResult = [];

                        var datefrom = parseDate(document.getElementById('datefrom').value);
                        var dateto = parseDate(document.getElementById('dateto').value);
                        for (var i=0; i<result.data.length; i++){
                            var datefromdata = parseDate(result.data[i].created_at);
                            if (dateto > datefromdata && datefrom < datefromdata)  {
                                filterBytimeResult.push(result.data[i]);
                            }
                        }           
                        //console.log(filterBytimeResult.length);

                        if (document.getElementById('datefrom').value === "" || document.getElementById('dateto').value === "")

                        {

                            /* This part is not have date filter*/


                            var cluster = L.markerClusterGroup();
                            var groupMarker = L.layerGroup();


                            for (var i = result.data.length - 1; i >= 0; i--) {
                            var myIcon = L.icon({
                                iconUrl: '/images/points.png',
                                iconSize: [10, 10],
                                iconAnchor: [10, 10]
                            });

                            var markers = L.marker([result.data[i].loc.coordinates[1], result.data[i].loc.coordinates[0]], {icon: myIcon}).bindPopup(result.data[i].keywords.toString()).openPopup();
                            cluster.addLayer(markers);

                            groupMarker.addLayer(markers);
                            //document.write(result.data[i].keywords);
                            //console.log(cluster);
                            }

                          if (result.data.length > 500)
                          {

                            leafletObject.addLayer(cluster);

                            cluster.on('clusterclick', function (a) {
                                // a.layer is actually a cluster
                                //console.log(a.layer.getAllChildMarkers());

                                var clickCluster = a.layer.getAllChildMarkers();
                                var markerIn = [];
                                
                                for (i = 0; i < clickCluster.length; i++) {
                                    //markerIn.push(clickCluster[i]._latlng.lat);
                                    markerIn.push(clickCluster[i]._popup._content);
                                }

                                console.log(markerIn);
                            });

                          }
                          else
                          {
                            leafletObject.addLayer(groupMarker);
                          }



                        }


                        else {

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
                            //document.write(result.data[i].keywords);
                            //console.log(result.data[i].keywords);

                        }

                          if (filterBytimeResult.length > 500)
                          {
                            leafletObject.addLayer(cluster);
                          }
                          else
                          {
                            leafletObject.addLayer(groupMarker);

                          }


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