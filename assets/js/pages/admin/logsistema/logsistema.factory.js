ng.factory( 'LogsistemaFactory', [
  '$http',
  function ( $http ) {
    return {
      get: function ( datos ) {
        return $http.post( '/api/v1/admin/logsistema/get', datos );
      }
    };
  },
] );
