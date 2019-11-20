/**
 * @param {scope} registros La variable de scope que lista los registros de la hoja actual
 *
 * @param {string} searchFor Atributo sobre el cual se generará el filtro
  *
 * @param {string} modelo El nombre de un modelo API controlado por Blueprints
 *                        *****Este metodo es automatico*****
 *                        Si existe @param url este metodo automatico es desactivado
 *
 * @param {string} url La POST url de un action, en caso de necesitar hacer manualmente la paginación
 * @param {string} opcionCuantos opcion-cuantos Cadena separada por comas de opciones de número de
 * @param {int} pagPag pag-pag Paginación de paginas, cuantos enlaces a páginas aparecen a la vez
 * @param {int} pag En que página quieres que inicie la paginación, puede empezar en cualquier número
 */
ng.directive( 'paginacionDirectiva', [
  '$http',
  '$timeout',
  function ( $http, $timeout ) {
    return {
      restrict: 'E',
      scope: {
        registros: '=',
        search: '=',
        refresh: '=',
        paginacion: '=',
        datosFecha: '=',
        cargando: '='
      },
      link: function ( scope, el, attrs ) {
        scope.refresh = false;
        scope.cargando = false;
        scope.time = true;
        scope.resultados = false;
        scope.$watch( 'datosFecha', ( newVal ) => {
          if ( !newVal ) { return; }
          if ( newVal && ( newVal.select === 'dia' || newVal.select === 'semana' || newVal.select === 'mes' ) ) {
            scope.paginacion.datosFecha = scope.datosFecha;
            scope.reloadGrid();
          }
          if ( newVal && newVal.fechaInicio && newVal.fechaFin ) {
            scope.paginacion.datosFecha = scope.datosFecha;
            scope.reloadGrid();
          }
          if ( newVal && newVal.mostrar === false && newVal.select ) {
            scope.paginacion.datosFecha = scope.datosFecha;
            delete newVal.select;
            scope.reloadGrid();
          }
        }, true );
        scope.pagOfPag = [];
        scope.registros = [];
        scope.paginacion = {
          url: attrs.url || '/api/v1/paginacion/pormodelo',
          opcionCuantos: attrs.opcionCuantos || '10 20 50 100',
          pagPag: attrs.pagPag || 5,
          pag: attrs.pag || 1,
          populate: attrs.populate || '',
          total: 0,
          paginas: 0,
          desde: 0,
          hasta: 0,
          misDatos: scope.datos || {}
        };
        // console.log('scope.paginacion:::::::', scope.paginacion);
        // inicializacion de attrs
        scope.paginacion.opcionCuantos = scope.paginacion.opcionCuantos.split( ' ' );
        scope.paginacion.cuantos = scope.paginacion.pagPag;

        /*
        ██████   ██████  ███████ ████████
        ██   ██ ██    ██ ██         ██
        ██████  ██    ██ ███████    ██
        ██      ██    ██      ██    ██
        ██       ██████  ███████    ██
        */

        scope.reloadGrid = function ( pag ) {
          if ( pag ) { scope.paginacion.pag = pag; }
          if ( scope.search && scope.search.length > 0 ) {
            scope.paginacion.search = scope.search;
          } else { delete scope.paginacion.search; }
          if ( scope.time ) {
            scope.time = false;
            setTimeout( () => {
              scope.sindatos = false;
              scope.cargando = true;
              scope.registros = [];
              scope.result = $http.post( scope.paginacion.url, scope.paginacion ).then( function success ( response ) {
                var data = response.data;
                scope.time = true;
                scope.paginacion.total = data.total;
                scope.paginacion.paginas = Math.ceil( scope.paginacion.total / scope.paginacion.cuantos );
                scope.getNumber( scope.paginacion.paginas );
                scope.paginacion.hasta = data.skip + data.registros.length;
                scope.paginacion.desde = data.skip === 0 ? 1 : data.skip;
                scope.registros = data.registros;
                scope.cargando = false;
                if ( scope.registros && scope.registros.length === 0 ) {
                  scope.sindatos = true;
                }
                scope.refresh = false;
                // console.log('  scope.paginacion---------------',   scope.paginacion);
                console.log( '  scope.paginacion---registros-------------', scope.registros );
                $timeout( () => {
                } );
              }, function error ( err ) {
                // console.log('Listado de registros::::::::::::::::::::::::::::::::::::::::::::::', err);
                console.log( 'Directiva Paginacion ->error', err );
                if ( err.status === 403 ) { alertify.error( 'Sin permiso para listar datos, Contacte con el Administrador' ); }
                if ( err.status === 500 ) { alertify.error( 'Error Intente Más Tarde' ); } else {
                  alertify.error( 'Error Intente Más Tarder' );
                }
              } );
            }, 500 );
          }
        };

        /*
        ██████   █████   ██████        ██████   █████   ██████
        ██   ██ ██   ██ ██             ██   ██ ██   ██ ██
        ██████  ███████ ██   ███ █████ ██████  ███████ ██   ███
        ██      ██   ██ ██    ██       ██      ██   ██ ██    ██
        ██      ██   ██  ██████        ██      ██   ██  ██████
        */

        scope.getNumber = function ( num ) {
          scope.pagOfPag = [];
          scope.up = Math.ceil( scope.paginacion.pag / scope.paginacion.pagPag ) * scope.paginacion.pagPag;
          scope.down = ( scope.up - scope.paginacion.pagPag ) + 1;
          if ( num < scope.up ) {
            scope.up = num;
          }
          if ( scope.down === scope.up && scope.down !== 1 ) { scope.down = scope.up - scope.paginacion.pagPag + 1; }
          var i;
          scope.pagOfPag = new Array();
          for ( i = scope.down; i <= scope.up; i++ ) {
            scope.pagOfPag.push( i );
          }
        };

        /*
        ██ ███████      █████   ██████ ████████ ██ ██    ██ ███████ ██████
        ██ ██          ██   ██ ██         ██    ██ ██    ██ ██           ██
        ██ ███████     ███████ ██         ██    ██ ██    ██ █████     ▄███
        ██      ██     ██   ██ ██         ██    ██  ██  ██  ██        ▀▀
        ██ ███████     ██   ██  ██████    ██    ██   ████   ███████   ██
        */
        scope.currentPage = function ( idx ) {
          var current = idx;
          if ( current === parseInt( scope.paginacion.pag ) ) { return true; }
          return false;
        };

        /*
         ██████ ████████ ██████  ██          ██████   █████   ██████  ███████
        ██         ██    ██   ██ ██          ██   ██ ██   ██ ██       ██
        ██         ██    ██████  ██          ██████  ███████ ██   ███ █████
        ██         ██    ██   ██ ██          ██      ██   ██ ██    ██ ██
         ██████    ██    ██   ██ ███████     ██      ██   ██  ██████  ███████
        */

        scope.changePage = function ( pag ) {
          if ( !pag ) {
            scope.paginacion.pag = 1;
            return scope.reloadGrid();
          }

          switch ( pag ) {
            case 'next':
              if ( scope.paginacion.pag < scope.paginacion.paginas ) {
                scope.paginacion.pag = scope.paginacion.pag + 1;
              } else { return; }
              break;
            case 'back':
              if ( scope.paginacion.pag !== 1 ) {
                scope.paginacion.pag = scope.paginacion.pag - 1;
              } else { return; }
              break;
            case 'npag':
              scope.paginacion.pag = scope.up + 1;
              break;
            case 'bpag':
              scope.paginacion.pag = scope.down - 1;
              break;
            default:
              scope.paginacion.pag = pag;
          }
          scope.reloadGrid();
        };

        /*
        ███████ ███████ ██      ███████  ██████ ████████      ██████  ██████   ██████
        ██      ██      ██      ██      ██         ██        ██    ██ ██   ██ ██
        ███████ █████   ██      █████   ██         ██        ██    ██ ██████  ██
             ██ ██      ██      ██      ██         ██        ██    ██ ██      ██
        ███████ ███████ ███████ ███████  ██████    ██         ██████  ██       ██████
        */
        scope.reloadCuantos = function () {
          var paginas = Math.ceil( scope.paginacion.total / scope.paginacion.cuantos );
          var pag = 1;
          if ( scope.paginacion.pag <= paginas ) { pag = scope.paginacion.pag; }
          scope.reloadGrid( pag );
        };

        /*
        ██     ██  █████  ████████  ██████ ██   ██     ███████ ██ ██   ████████ ███████ ██████
        ██     ██ ██   ██    ██    ██      ██   ██     ██      ██ ██      ██    ██      ██   ██
        ██  █  ██ ███████    ██    ██      ███████     █████   ██ ██      ██    █████   ██████
        ██ ███ ██ ██   ██    ██    ██      ██   ██     ██      ██ ██      ██    ██      ██   ██
         ███ ███  ██   ██    ██     ██████ ██   ██     ██      ██ ███████ ██    ███████ ██   ██
        */
        scope.$watch( 'refresh', ( valor ) => {
          if ( scope.refresh ) {
            scope.reloadGrid();
            console.log( 'cargando datos Directiva Paginación', valor );
          }
        } );

        scope.$watch( 'search', ( valor ) => {
          if ( !valor ) {
            scope.reloadGrid( 1 );
          }
        } );
        scope.reloadGrid();
      },
      template: JST['assets/templates/sistema/paginacion.directiva.html']()
    };
  },
] );
