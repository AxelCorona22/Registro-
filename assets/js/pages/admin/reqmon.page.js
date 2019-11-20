ng.controller( 'reqmonController', [
  '$rootScope',
  '$scope',
  function ( $rootScope, $scope ) {
    _.extend( $scope, SAILS_LOCALS );

    $scope.syncing = false;

    $scope.init = function () {
      console.log( 'reqmonController ha sido inicializado.' );
      $scope.reqs = [];
    };

    $scope.$on( 'request', ( evt, data ) => {
      data.timestamp = ( new Date() ).toISOString();
      $scope.reqs.push( data );
    } );

  },
] );
