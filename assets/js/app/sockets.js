ng.run( [
  '$sails',
  '$rootScope',
  '$http',
  function ( $sails, $rootScope, $http ) {

    var checkStatus = function () {
      $http.get( '/estatus.txt' ).then(
      ( texto ) => {
        if ( texto.data && typeof texto.data === 'string' ) {
          $rootScope.app.error = false;
          switch ( texto.data.trim() ) {
            case 'online':
              $rootScope.app.instalando = false;
              break;
            case 'instalando':
              $rootScope.app.instalando = true;
              break;
            default:
              $rootScope.app.instalando = false;
          }
        }
      },
      ( err ) => {
        // tampoco respondió NGINX, posible error de conexion...
        $rootScope.app.error = 'conexion';
        console.log( 'estatus.txt:error', err );
      }
      );
    };

    var setEvents = function () {
      $sails.on( 'connect', () => {
        $rootScope.$broadcast( 'connect' );
        $rootScope.app.conectado = true;
        $rootScope.app.conectando = false;
        $rootScope.app.canales();
        $rootScope.app.intentos = 0;
      } );

      $sails.on( 'disconnect', () => {
        $rootScope.$broadcast( 'disconnect' );
        $rootScope.app.conectado = false;
        $rootScope.app.conectando = true;
        // tratar de obtener /estatus.txt
        // si lo encontramos, evaluar el contenido...
        checkStatus();
        console.log( '$sails', $sails );
      } );

      $sails.on( 'reconnecting', ( intentos ) => {
        $rootScope.$broadcast( 'reconnecting' );
        $rootScope.app.intentos = intentos;
        $rootScope.app.conectando = true;
        checkStatus();
      } );

      $sails.on( 'reconnect', () => {
        $rootScope.$broadcast( 'reconnect' );
        // estabamos instalando? y no hay error? -> refresh();
        if ( !$rootScope.app.error ) {
          console.log( 'reload!' );
          document.location.reload();
        }
        checkStatus();
      } );

      $sails.on( 'login', ( user ) => {
        const message = 'Inicio de sesión: ' + user;
        alertify.message( message );
        $rootScope.$broadcast( 'login', user );
      } );
    };

    setEvents();

  },
] );
