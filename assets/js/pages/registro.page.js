ng.controller( 'registroController', [
  '$rootScope',
  '$scope',
  '$http',
  function ( $rootScope, $scope, $http ) {
    _.extend( $scope, SAILS_LOCALS );

    $scope.registro = {
      nick: '',
      fullName: '',
      emailAddress: '',
      password: '',
      password2: '',
      celular: ''
    };

    $scope.syncing = false;

    $scope.init = function () {
      console.log( 'registroController ha sido inicializado.' );
    };

    $scope.agregarUsuario = function () {
      console.log( 'enviando:', $scope.lregistro );
      $http.post( '/api/v1/alumnos', $scope.registro ).then( ( response ) => {
        console.log( 'respuesta de guardar alumno', response );
        alertify.success( 'Registro Generado.' );
        $scope.registro = response.data;
      }, ( error ) => {
        alertify.error( error.data );
        console.log( 'error al guardar alumno', error );
      } );
      $scope.registro = {};
    };
  },
] );
