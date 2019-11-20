ng.factory( 'PermisosFactory', [
  '$http',
  function ( $http ) {
    return {
      traer: function () {
        return $http.get( '/api/v1/admin/permisos/get' );
      },
      toogle: function ( datos ) {
        return $http.post( '/api/v1/admin/usuarios/toogle-permiso', datos );
      },
      addpermiso: function ( data ) {
        return $http.post( '/api/v1/admin/usuarios/add-permiso', data );
      },
      save: function ( data ) {
        return $http.post( '/api/v1/admin/permisos/save', data );
      }
    };
  },
] );
