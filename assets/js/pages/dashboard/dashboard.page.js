ng.controller( 'dashboardController', [
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  function ( $rootScope, $scope, $http, $timeout ) {
    // Attach any initial data from the server
    _.extend( $scope, SAILS_LOCALS );

    $scope.ver = 'pie';

    $scope.init = function () {
      if ( $scope.me.perfilName === 'director' ) {
        $scope.loadGraphData(); // los datos iniciales ya vienen con la vista, iniciar el grafico
      }
    };

    // en cada evento que llegue una nueva, procesarla
    $scope.$on( 'nuevaCita', ( evt, cita ) => {
      alertify.success( 'Nueva Cita generada, módulo: ' + cita.nombreModulo );
      $scope.reloadData();
    } );

    var timerReload;
    $scope.$on( 'citaPagada', () => {
      console.log( 'citaPagada' );
      if ( timerReload ) {
        $timeout.cancel( timerReload );
        timerReload = false;
      }
      timerReload = $timeout( () => {
        alertify.success( 'Se han recibido pagos.' );
        $scope.reloadData();
      }, 1000 );
    } );

    $scope.reloadData = function () {
      $http.get( '/api/v1/dashboard/refresh-data' ).then(
        ( response ) => {
          console.log( 'refresh-data:', response );
          if ( response.data.dashboard ) {
            $scope.dashboard = response.data.dashboard;
            $scope.loadGraphData();
          }
        },
        ( error ) => {
          console.log( 'Error al refrescar data de dashboard', error );
        }
      );
    };

    $scope.topBar = 15;
    $scope.topSlice = 15;

    $scope.loadGraphData = function () {
      if ( !$scope.dashboard || !$scope.dashboard.modulos || !$scope.dashboard.modulos.length ) {
        console.log( 'No hay nada que hacer sin modulos' );
        return;
      }
      $scope.series = [
        'Pagadas',
        'No Pagadas',
      ];
      $scope.labelsBar = $scope.dashboard.modulos.slice( 0, $scope.topBar );
      $scope.dataBar = [
        $scope.dashboard.citasPagadas.slice( 0, $scope.topBar ), // 0
        $scope.dashboard.citasNoPagadas.slice( 0, $scope.topBar ), // 1
      ];

      // tomar las primeras topSlice, el remanente ponerlo en uno solo y agregarlo
      var todos = angular.copy( $scope.dashboard.citasTotal );
      var etiquetasTodos = angular.copy( $scope.dashboard.modulos );
      // citas del final...
      var iniciales = todos.slice( 0, $scope.topSlice );
      // citas del inicio
      var remanente = todos.slice( $scope.topSlice, todos.length + 1 );
      var etiquetasIniciales = etiquetasTodos.slice( 0, $scope.topSlice );
      var totalRemanente = _.sum( remanente );
      iniciales.push( totalRemanente );
      etiquetasIniciales.push( 'LOS DEMÁS' );
      $scope.dataPie = iniciales;
      $scope.labelsPie = etiquetasIniciales;


      $scope.colors = [
        'rgba(156,156,200,.9)',
        'rgba(255,156,156,.9)',
      ];

      $scope.chartOptionsBar = {
        scales: {
          xAxes: [
            {
              stacked: true
            },
          ],
          yAxes: [
            {
              stacked: true
            },
          ]
        },
        title: {
          display: true,
          fontStyle: 'bold',
          fontSize: 18,
          padding: 30,
          text: [
            'Solicitudes de Citas por Módulo',
            'Pagadas y no pagadas (Top ' + $scope.topBar + ')',
          ]
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 50
          }
        }
      };


      $scope.chartOptionsPie = {
        plugins: {
          labels: [
            {
              fontColor: '#444',
              position: 'outside',
              fontStyle: 'bold',
              precision: 1,
              render: function ( args ) {
                return args.label + ' - ' + args.percentage + '%';
              }
            },
            {
              render: 'value',
              fontColor: 'black',
              fontStyle: 'bold',
              overlap: false,
              position: 'border'
            },
          ]
        },
        title: {
          display: true,
          fontStyle: 'bold',
          fontSize: 18,
          padding: 30,
          text: [ 'Solicitudes de Citas Generadas en Módulos: ' + _.sum( $scope.dashboard.citasTotal ), ]
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 30
          }
        }
      };
    };


  },
] );
