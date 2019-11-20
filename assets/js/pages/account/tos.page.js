ng.controller( 'tosController', [
  '$rootScope',
  '$scope',
  '$http',
  function ( $rootScope, $scope, $http ) {
    _.extend( $scope, SAILS_LOCALS );

    $scope.syncing = false;

    $scope.init = function () {
      console.log( 'tosController ha sido inicializado.' );
    };

    $scope.aceptar = function () {
      $scope.syncing = true;
      $http.post( '/api/v1/account/accept-tos' ).then( function success () {
        window.location = '/';
      }, function error ( err ) {
        $scope.syncing = false;
        console.log( 'Error accept-tos:', err );
        alertify.error( 'No se pudo continuar, inténtelo mas tarde.' );
      } );
    };

    $scope.noaceptar = function () {
      $scope.syncing = true;
      window.location = '/logout';
    };

  },
] );
