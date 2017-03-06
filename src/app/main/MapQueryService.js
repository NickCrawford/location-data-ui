(function() {

    'use strict';

    angular
    .module('locationDataUi')
    .factory('MapQueryService', MapQueryService);

    function MapQueryService($http, $log, Environment) {

        return {
            circleQuery: circleQuery,
            polyQuery: polyQuery
        }

        function circleQuery(lat, long, radius, start, end) {
            $log.log(lat, long,radius);
            var request = {
                method: 'GET',
                url: Environment.apiUrl + '/near/'+lat+','+long+'/'+radius+','+'start='+start+',end='+end

            };

            return $http(request)
            .then(function(result) {
                $log.log(result);
                return result;

            });

        }

        function polyQuery(coordinates, start, end) {
            var coordString = "";

            for (var i = coordinates.length - 1; i >= 0; i--) {
                coordString += coordinates[i].lat +","+ coordinates[i].lng + ",";
            }
            //Close the loop
            coordString += coordinates[coordinates.length-1].lat +","+ coordinates[coordinates.length-1].lng

            $log.log(coordString);
            var request = {
                method: 'GET',
                url: Environment.apiUrl + '/poly/'+coordString+'/'+'start='+start+',end='+end

            };

            return $http(request)
            .then(function(result) {
                $log.log(result);
                return result;

            });

        }
    }

}());
