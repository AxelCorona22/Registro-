ng.controller( 'proyectosController', [
  '$rootScope',
  '$scope',
  function ( $rootScope, $scope ) {
    _.extend( $scope, SAILS_LOCALS );

    $scope.syncing = false;

    $scope.init = function () {
      console.log( 'proyectosController ha sido inicializado.' );
    };

  },
] );
