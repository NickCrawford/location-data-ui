(function() {

    'use strict';

    angular
    .module('locationDataUi')
    .factory('MapQueryService', MapQueryService);

    function MapQueryService($http, Environment) {

        return {
            circleQuery: circleQuery
        }

        function circleQuery(lat, long, radius) {
            console.log(lat, long,radius);
            var request = {
                method: 'GET',
                url: Environment.apiUrl + '/near/'+lat+','+long+'/'+radius

            };

            //router.get('/near/:lat,:long/:max?-:min?', locations.near);

            return $http(request)
            .then(function(result) {

                return result;

            });

        }
    }

}());
