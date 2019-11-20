ng.directive( 'usuarioDirectiva', [
  '$http',
  'PerfilesFactory',
  function ( $http, PerfilesFactory ) {
    return {
      scope: {
        user: '=',
        bloqueado: '='
      },
      link: function ( scope ) {
        scope.$watch( 'user', () => {

          /*
        ██████  ███████ ██████  ███████ ██ ██      ███████ ███████
        ██   ██ ██      ██   ██ ██      ██ ██      ██      ██
        ██████  █████   ██████  █████   ██ ██      █████   ███████
        ██      ██      ██   ██ ██      ██ ██      ██           ██
        ██      ███████ ██   ██ ██      ██ ███████ ███████ ███████
        */
          PerfilesFactory.get().then( ( response ) => {
            console.log( 'PerfilesFactory.get()->success', response.data );
            scope.perfiles = response.data;
          }, ( err ) => {
            console.log( 'PerfilesFactory.get()->error', err );
          } );
        } );
        scope.autoMunicipio = function ( userInputString, timeoutPromise ) {
          return $http.post( '/api/v1/catalogos/municipios/auto', { term: userInputString }, { timeout: timeoutPromise } );
        };

        /*
      ███████ ███████ ██      ███████  ██████  ██████ ██  ██████  ███    ██  █████      ███    ███ ██    ██ ███    ██ ██  ██████ ██ ██████  ██  ██████
      ██      ██      ██      ██      ██      ██      ██ ██    ██ ████   ██ ██   ██     ████  ████ ██    ██ ████   ██ ██ ██      ██ ██   ██ ██ ██    ██
      ███████ █████   ██      █████   ██      ██      ██ ██    ██ ██ ██  ██ ███████     ██ ████ ██ ██    ██ ██ ██  ██ ██ ██      ██ ██████  ██ ██    ██
           ██ ██      ██      ██      ██      ██      ██ ██    ██ ██  ██ ██ ██   ██     ██  ██  ██ ██    ██ ██  ██ ██ ██ ██      ██ ██      ██ ██    ██
      ███████ ███████ ███████ ███████  ██████  ██████ ██  ██████  ██   ████ ██   ██     ██      ██  ██████  ██   ████ ██  ██████ ██ ██      ██  ██████
      */
        scope.seleccionaMunicipio = function ( valor ) {
          scope.localidades = [];
          scope.user.municipio = valor.originalObject;
        };
      },
      restrict: 'E',
      transclude: true,
      template: JST['assets/templates/usuarios/usuariosDirectiva.html']()
    };
  },
] );
