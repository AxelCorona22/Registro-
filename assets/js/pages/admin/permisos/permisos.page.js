ng.controller( 'permisosControllerView', [
  '$rootScope',
  '$scope',
  '$http',
  'PermisosFactory',
  function ( $rootScope, $scope, $http, PermisosFactory ) {
    _.merge( $scope, SAILS_LOCALS );
    /*
    ██ ███    ██ ██ ████████
    ██ ████   ██ ██    ██
    ██ ██ ██  ██ ██    ██
    ██ ██  ██ ██ ██    ██
    ██ ██   ████ ██    ██
    */
    $scope.init = function () {
      $scope.searchGeneral = '';
      $scope.datosFecha = { mostrar: false };
      $scope.permisos = [];
      $scope.editando = true;
      $scope.permiso = {};
      $scope.desactivado = {};
      $scope.desactivados = [];
      $scope.formData = {};
      $scope.searchGeneral = '';
      $scope.datosFecha = { mostrar: false };

    };
    // directiva
    $scope.iniciarBusqueda = function () {
      $scope.refresh = true;
    };
    $scope.teclaBusqueda = function ( event ) {
      if ( event.keyCode === 13 ) {
        $scope.iniciarBusqueda();
      }
    };
    $scope.limpia = function () {
      $scope.pestana = '';
      $scope.permiso = {};
      $scope.direccion = {};
      $scope.borrar = false;
      $scope.guardar = false;
      $scope.bloqueado = false;
    };
    $scope.showModalP = function () {
      $scope.permiso = {};
      $scope.direccion = {};
      $scope.pestana = 'agregar';
      $scope.borrar = false;
      $scope.guardar = true;
      $scope.bloqueado = false;
    };
    $scope.editar = function ( permiso ) {
      $scope.permiso = angular.copy( permiso );
      $scope.pestana = 'editar';
      $scope.guardar = true;
      $scope.borrar = false;
      $scope.bloqueado = false;
    };
    $scope.delete = function ( permiso ) {
      $scope.permiso = angular.copy( permiso );
      $scope.pestana = 'borrar';
      $scope.borrar = true;
      $scope.guardar = false;
    };
    /*
     ██████  ██    ██  █████  ██████  ██████   █████  ██████
    ██       ██    ██ ██   ██ ██   ██ ██   ██ ██   ██ ██   ██
    ██   ███ ██    ██ ███████ ██████  ██   ██ ███████ ██████
    ██    ██ ██    ██ ██   ██ ██   ██ ██   ██ ██   ██ ██   ██
     ██████   ██████  ██   ██ ██   ██ ██████  ██   ██ ██   ██
     */
    $scope.guardarPermiso = function () {
      $scope.formData.permiso = $scope.permiso;
      PermisosFactory.save( $scope.formData ).then( function success ( response ) {
        var idx = _.findIndex( $scope.permisos, { id: response.data.id } );
        if ( idx > -1 ) {
          $scope.permisos[idx] = response.data;
          alertify.success( 'Permisos creado satisfactoriamente.' );
        } else {
          $scope.permisos.push( response.data );
        }
        console.log( 'PermisosFactory.save()->success:', response );
      }, function error ( err ) {
        console.log( 'AgenciasFactory.save()->error', err );
      } );
    };
  },
] );
