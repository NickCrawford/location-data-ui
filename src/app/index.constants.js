/* global malarkey:false, moment:false */
(function() {
  'use strict';

var host = 'local';

  angular
    .module('locationDataUi')
    .constant('Environment', Environment(host));

    function Environment(host) {
    	var LocalConfig = {
    		environment: 'stage',
    		apiUrl: 'http://127.0.0.1:3000/v1.0'
    	}

    	if (host === 'local') {
    		return LocalConfig;
    	}
    }

})();
