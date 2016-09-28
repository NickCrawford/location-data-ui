(function() {
  'use strict';

  angular
    .module('locationDataUi')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
