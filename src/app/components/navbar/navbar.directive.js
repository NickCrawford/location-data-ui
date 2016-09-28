(function() {
  'use strict';

  angular
    .module('locationDataUi')
    .directive('locationNavbar', locationNavbar);

  /** @ngInject */
  function locationNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController() {
      var vm = this;

    }
  }

})();
