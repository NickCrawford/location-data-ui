(function() {
  'use strict';

  angular
  .module('locationDataUi')
  .directive('locationMap', locationMap);

  /** @ngInject */
  function locationMap() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/map/map.html',
      controller: MapController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function MapController($scope, $window) {
      var vm = this;

      vm.height = $window.innerHeight - 40 
      - (angular.element(document.querySelector('.mdl-layout__header'))[0].offsetHeight)
      - (angular.element(document.querySelector('.mdl-mini-footer'))[0].offsetHeight);
      
      console.log(vm.height);

    }
  }

})();