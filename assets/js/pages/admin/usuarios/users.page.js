ng.controller( 'usuariosController', [
  '$rootScope',
  '$scope',
  '$http',
  'UsuariosFactory',
  'PermisosFactory',
  function ( $rootScope, $scope, $http, UsuariosFactory, PermisosFactory ) {
    _.merge( $scope, SAILS_LOCALS );
    $scope.usuarios = [];
    $scope.formData = {};
    $scope.pestana = 'generales';
    $scope.user = {};
    $scope.searchGeneral = '';
    $scope.datosFecha = { mostrar: false };
    /*
    ██ ███    ██ ██ ████████
    ██ ████   ██ ██    ██
    ██ ██ ██  ██ ██    ██
    ██ ██  ██ ██ ██    ██
    ██ ██   ████ ██    ██
    */
    $scope.init = function () {
      $scope.perms = [];
      PermisosFactory.traer().then(
 ( response ) => {
   // console.log('PermisosFactory.get()->success:', response.data);
   $scope.perms = response.data;
 },
      ( err ) => {
        console.log( 'UsuariosFactory.get()->error:', err );
      }
      );
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
    $scope.shownPermisos = function ( user ) {
      $scope.user = user;
      $( '#myModalPermisos' ).modal( 'show' );
      var p = [];
      angular.forEach( angular.copy( $scope.perms ), ( e ) => {
        if ( !e.categoria ) { e.categoria = 'Sin Categoria'; }
        if ( _.indexOf( $scope.user.permisos, e.valor ) > -1 ) {
          e.aplicado = true;
        }
        p.push( e );
      } );
      $scope.permisos = _.groupBy( p, 'categoria' );
    };
    $scope.cambioPermiso = function ( perm ) {
      PermisosFactory.toogle( { id: $scope.user.id,
        perm: perm } ).then( ( response ) => {
        alertify.success( 'Se actualizó' );
        var idx = _.findIndex( $scope.usuarios, { id: $scope.user.id } );
        if ( idx > -1 ) { $scope.usuarios[idx].permisos = response.data; }
      }, ( err ) => {
        console.log( 'PermisosFactory.toogle()->error:', err );
        alertify.error( err );
      } );
    };
    // Agregar usuario
    $scope.showUsuario = function ( user ) {
      if ( user ) {
        // console.log('Datos del usuario: ****: ', user);
        $scope.user = user;
        var idx = _.findIndex( $scope.modulos, { id: $scope.user.modulo } );
        if ( idx > -1 ) { $scope.user.modulo = $scope.modulos[idx]; }
      } else { $scope.user = {}; }
      $( '#myModal' ).modal( 'show' );
    };
    /*
     ██████  ██    ██  █████  ██████  ██████   █████  ██████  ██    ██ ███████ ██    ██  █████  ██████  ██  ██████
    ██       ██    ██ ██   ██ ██   ██ ██   ██ ██   ██ ██   ██ ██    ██ ██      ██    ██ ██   ██ ██   ██ ██ ██    ██
    ██   ███ ██    ██ ███████ ██████  ██   ██ ███████ ██████  ██    ██ ███████ ██    ██ ███████ ██████  ██ ██    ██
    ██    ██ ██    ██ ██   ██ ██   ██ ██   ██ ██   ██ ██   ██ ██    ██      ██ ██    ██ ██   ██ ██   ██ ██ ██    ██
     ██████   ██████  ██   ██ ██   ██ ██████  ██   ██ ██   ██  ██████  ███████  ██████  ██   ██ ██   ██ ██  ██████
    */
    $scope.guardarUsuario = function () {
      // console.log('Datos del usuario: ****: ', $scope.user);
      UsuariosFactory.save( angular.copy( $scope.user ) ).then( function succcess ( response ) {
        var idx = _.findIndex( $scope.usuarios, { id: response.data.id } );
        // console.log('Registro editado correctamente:::', response.data, 'idx:', idx);
        if ( idx > -1 ) {
          alertify.success( 'Registro Editado Correctamente.' );
          $scope.usuarios[idx] = response.data;
          $( '#myModal' ).modal( 'hide' );
        } else {
          alertify.success( 'Registro Agregado Correctamente.' );
          $scope.usuarios.unshift( response.data );
          $( '#myModal' ).modal( 'hide' );
        }
        // console.log('UsuariosFactory.save()->success:', response);
        $scope.user = {};
      }, function error ( err ) {
        if ( err.status === 403 ) {
          alertify.error( 'Error al guardar datos, Contacte con el Administrador' );
        }
        console.log( 'UsuariosFactory.save()->error:', err );
      } );
    };
  },
] );
