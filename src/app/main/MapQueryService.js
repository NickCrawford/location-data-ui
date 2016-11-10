(function() {
    "use strict";

    angular
        .module('locationDataUi')
        .factory('MapQueryService', MapQueryService)

    function MapQueryService($http, Environment, Auth, WebSocketService) {

        return {
            squareQuery: squareQuery
        }

        function squareQuery(region) {
            console.log(Enviorment);
            var request = {
                method: 'GET',
                url: Environment.apiUrl + '',
                params: {
                    offset: index,
                    limit: numToLoad,
                }
            };

            return $http(request)
            .then(function(result) {

                console.log(result);

                // convos = convos.append(result.data);
                convos = result.data;

                if (convos.length < numToLoad) {
                    hasMoreData = false;
                }else{
                    index += numToLoad;
                }

                return {
                    convos: convos,
                    hasMoreData: hasMoreData
                };
            });
        } else {
            throw new Error('no more convos to return')
        }

    }

}());
