ng.controller( 'logsistemaController', [
  '$rootScope',
  '$scope',
  'uiGridConstants',
  '$timeout',
  '$templateCache',
  'LogsistemaFactory',
  function ( $rootScope, $scope, uiGridConstants, $timeout, $templateCache, LogsistemaFactory ) {
    _.extend( $scope, SAILS_LOCALS );

    $scope.syncing = false;

    $scope.init = function () {
      console.log( 'logsistemaController ha sido inicializado.' );
      $scope.log = {};
      $scope.searchGeneral = '';
      $scope.datosFecha = { mostrar: false };
    };
    $scope.modalLog = function ( log ) {
      $scope.log = angular.copy( log );
      $( '#showModal' ).modal( 'show' );
    };
    /*
    ██ ███    ██ ██  ██████ ██  ██████      ██████   █████   ██████  ██ ███    ██  █████  ████████ ██  ██████  ███    ██
    ██ ████   ██ ██ ██      ██ ██    ██     ██   ██ ██   ██ ██       ██ ████   ██ ██   ██    ██    ██ ██    ██ ████   ██
    ██ ██ ██  ██ ██ ██      ██ ██    ██     ██████  ███████ ██   ███ ██ ██ ██  ██ ███████    ██    ██ ██    ██ ██ ██  ██
    ██ ██  ██ ██ ██ ██      ██ ██    ██     ██      ██   ██ ██    ██ ██ ██  ██ ██ ██   ██    ██    ██ ██    ██ ██  ██ ██
    ██ ██   ████ ██  ██████ ██  ██████      ██      ██   ██  ██████  ██ ██   ████ ██   ██    ██    ██  ██████  ██   ████
    */
    var paginationOptions = {
      pageNumber: 1,
      pageSize: 10,
      sort: [],
      filters: {}
    };

    /*
     ██████  ███████ ████████ ██████   █████   ██████  ███████
    ██       ██         ██    ██   ██ ██   ██ ██       ██
    ██   ███ █████      ██    ██████  ███████ ██   ███ █████
    ██    ██ ██         ██    ██      ██   ██ ██    ██ ██
     ██████  ███████    ██    ██      ██   ██  ██████  ███████
    */// ir por la pagina que contienen las opciones globales
    var getPage = function () {
      LogsistemaFactory.get( paginationOptions ).then( ( response ) => {
        console.log( 'LogsistemaFactory.get()->response:', response );
        $scope.gridLog.totalItems = response.data.totalItems;
        $scope.gridLog.data = response.data.data;
      }, ( error ) => {
        console.log( 'LogsistemaFactory.get()->error:', error );
        alertify.error( 'No se pudo obtener los registros' );
      } );
    };

    /*
    ████████ ██ ███    ███ ███████ ██████
       ██    ██ ████  ████ ██      ██   ██
       ██    ██ ██ ████ ██ █████   ██████
       ██    ██ ██  ██  ██ ██      ██   ██
       ██    ██ ██      ██ ███████ ██   ██
    */

    var timer;
    var tryGetPage = function () {
      if ( timer ) {
        $timeout.cancel( timer );
      }
      timer = $timeout( () => {
        getPage();
      }, 500 );
    };

    /*
    ██████   ██████  ██     ██  ██████ ██      ██  ██████ ██   ██
    ██   ██ ██    ██ ██     ██ ██      ██      ██ ██      ██  ██
    ██████  ██    ██ ██  █  ██ ██      ██      ██ ██      █████
    ██   ██ ██    ██ ██ ███ ██ ██      ██      ██ ██      ██  ██
    ██   ██  ██████   ███ ███   ██████ ███████ ██  ██████ ██   ██
    */

    $scope.rowClick = function ( row ) {
      var index = row.grid.renderContainers.body.visibleRowCache.indexOf( row );
      console.log( index );
      // console.log('rowClick', index, $scope.gridLog.data[index]);
      $scope.log = $scope.gridLog.data[index];
      $scope.modalLog( $scope.log );
    };
    /*
     ██████  ██████  ██ ██████  ████████ ██████   █████  ███    ███ ██ ████████ ███████ ███████
    ██       ██   ██ ██ ██   ██    ██    ██   ██ ██   ██ ████  ████ ██    ██    ██      ██
    ██   ███ ██████  ██ ██   ██    ██    ██████  ███████ ██ ████ ██ ██    ██    █████   ███████
    ██    ██ ██   ██ ██ ██   ██    ██    ██   ██ ██   ██ ██  ██  ██ ██    ██    ██           ██
     ██████  ██   ██ ██ ██████     ██    ██   ██ ██   ██ ██      ██ ██    ██    ███████ ███████
    */

    $scope.gridLog = {
      paginationPageSizes: [
        10,
        20,
        50,
        100,
      ],
      paginationPageSize: 10,
      enableFiltering: true,
      useExternalFiltering: true,
      useExternalPagination: true,
      useExternalSorting: true,
      maxVisibleRowCount: 30,
      rowTemplate: '<div ng-click="grid.appScope.rowClick(row)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell pointer" ui-grid-cell></div>',
      data: [],
      columnDefs: [
        { name: 'userName',
          displayName: 'Usuario' },
        { name: 'url',
          displayName: 'URL visitada' },
        { name: 'userAgent',
          enableSorting: false,
          displayName: 'Navegador',
          enableFiltering: false },
        { name: 'createdAt',
          enableSorting: true,
          displayName: 'Fecha de Ingreso',
          width: '20%',
          cellTooltip: true,
          cellFilter: 'date:\'yyyy-MM-dd, hh:mm a\'',
          cellTemplate: 'ui-grid/date-cell',
          filterHeaderTemplate: 'ui-grid/ui-grid-date-filter',
          filters: [
            {
              condition: 'gt',
              placeholder: 'Después de'
            },
            {
              condition: 'lt',
              placeholder: 'Antes de'
            },
          ],
          headerCellClass: $scope.highlightFilteredHeader },
        { name: 'ip',
          displayName: 'Dirección IP' },
      ],
      onRegisterApi: function ( gridApi ) {
        $scope.gridApi = gridApi;

        /*
        ███████  ██████  ██████  ████████
        ██      ██    ██ ██   ██    ██
        ███████ ██    ██ ██████     ██
             ██ ██    ██ ██   ██    ██
        ███████  ██████  ██   ██    ██
        */

        $scope.gridApi.core.on.sortChanged( $scope, ( grid, sortColumns ) => {
          console.log( 'sortChanged', sortColumns );

          var sort = [];

          if ( sortColumns.length === 0 ) {
            paginationOptions.sort = null;
          } else {
            sortColumns.map( ( col ) => {
              sort.push( { field: col.field,
                order: col.sort.direction,
                priority: col.sort.priority } );
            } );

            paginationOptions.sort = sort;
          }
          getPage();
        } );

        /*
        ██████   █████   ██████  ██ ███    ██  █████  ████████ ██  ██████  ███    ██
        ██   ██ ██   ██ ██       ██ ████   ██ ██   ██    ██    ██ ██    ██ ████   ██
        ██████  ███████ ██   ███ ██ ██ ██  ██ ███████    ██    ██ ██    ██ ██ ██  ██
        ██      ██   ██ ██    ██ ██ ██  ██ ██ ██   ██    ██    ██ ██    ██ ██  ██ ██
        ██      ██   ██  ██████  ██ ██   ████ ██   ██    ██    ██  ██████  ██   ████
        */

        gridApi.pagination.on.paginationChanged( $scope, ( newPage, pageSize ) => {
          paginationOptions.pageNumber = newPage;
          paginationOptions.pageSize = pageSize;
          getPage();
        } );

        /*
        ███████ ██ ██   ████████ ███████ ██████  ███████
        ██      ██ ██      ██    ██      ██   ██ ██
        █████   ██ ██      ██    █████   ██████  ███████
        ██      ██ ██      ██    ██      ██   ██      ██
        ██      ██ ███████ ██    ███████ ██   ██ ███████
        */

        $scope.gridApi.core.on.filterChanged( $scope, function () {
          var grid = this.grid;
          var filters = [];
          grid.columns.map( ( col ) => {
            // console.log('filters',col.filters);
            if ( col.filters && col.filters.length ) {
              filters.push( { field: col.field,
                filters: col.filters } );
            }
          } );
          paginationOptions.filters = filters;
          tryGetPage();
        } );
      }
    };

    // pagina inicial!
    getPage();


    // Set Bootstrap DatePickerPopup config
    $scope.datePicker = {

      options: {
        formatMonth: 'MM',
        startingDay: 1
      },
      format: 'yyyy-MM-dd'
    };

    // Set two filters, one for the 'Greater than' filter and other for the 'Less than' filter
    $scope.showDatePopup = [];
    $scope.showDatePopup.push( { opened: false } );
    $scope.showDatePopup.push( { opened: false } );

    $templateCache.put(
 'ui-grid/date-cell',
          '<div class=\'ui-grid-cell-contents\'>{{COL_FIELD | date:\'yyyy-MM-dd, hh:mm a\'}}</div>'
    );

    // Custom template using Bootstrap DatePickerPopup
    // Custom template using Bootstrap DatePickerPopup
    $templateCache.put(
 'ui-grid/ui-grid-date-filter',
          '<div class="inline ui-grid-filter-container" ng-repeat="colFilter in col.filters" >' +
              '<input ng-focus="showDatePopup[$index].opened = true" type="text" uib-datepicker-popup="{{datePicker.format}}" ' +
                      'datepicker-options="datePicker.options" ' +
                      'datepicker-append-to-body="true" show-button-bar="true"' +
                      'is-open="showDatePopup[$index].opened" class="ui-grid-filter-input ui-grid-filter-input-{{$index}}"' +
                      'style="font-size:1em; width:11em!important" ng-model="colFilter.term" ng-attr-placeholder="{{colFilter.placeholder || \'\'}}" ' +
                      ' aria-label="{{colFilter.ariaLabel || aria.defaultFilterLabel}}" />' +

                  '<span style="padding-left:0.3em;"><button type="button" class="btn btn-default btn-sm" ng-click="showDatePopup[$index].opened = true">' +
                      '<i class="far fa-calendar-alt" aria-hidden></i></button></span>' +

                  '<div role="button" style="padding-left:0.5em;" class="ui-grid-filter-button" ng-click="removeFilter(colFilter, $index)" ng-if="!colFilter.disableCancelFilterButton" ng-disabled="colFilter.term === undefined || colFilter.term === null || colFilter.term === \'\'" ng-show="colFilter.term !== undefined && colFilter.term !== null && colFilter.term !== \'\'">' +
                      '<i class="ui-grid-icon-cancel" ui-grid-one-bind-aria-label="aria.removeFilter">&nbsp;</i></div></div><div ng-if="colFilter.type === \'select\'"><select class="ui-grid-filter-select ui-grid-filter-input-{{$index}}" ng-model="colFilter.term" ng-attr-placeholder="{{colFilter.placeholder || aria.defaultFilterLabel}}" aria-label="{{colFilter.ariaLabel || \'\'}}" ng-options="option.value as option.label for option in colFilter.selectOptions"><option value=""></option></select><div role="button" class="ui-grid-filter-button-select" ng-click="removeFilter(colFilter, $index)" ng-if="!colFilter.disableCancelFilterButton" ng-disabled="colFilter.term === undefined || colFilter.term === null || colFilter.term === \'\'" ng-show="colFilter.term !== undefined && colFilter.term != null"><i class="ui-grid-icon-cancel" ui-grid-one-bind-aria-label="aria.removeFilter">&nbsp;</i></div></div>'
    );


  },
] );
