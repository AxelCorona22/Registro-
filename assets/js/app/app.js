/* eslint-disable no-unused-vars*/
/* eslint-disable no-redeclare*/
if ( SAILS_LOCALS && SAILS_LOCALS._environment && SAILS_LOCALS._environment === 'production' ) {
  // console.log= function(){return;};
}

var ng = angular.module( 'angularjs-app', [
  'ngSails',
  'ngSanitize',
  'moment-picker',
  'angucomplete-alt',
  'ngFileUpload',
  'ui.grid',
  'ui.grid.pagination',
  'ui.bootstrap',
  'ngDialog',
  'chart.js',
  'mwl.calendar',
] );

ng.run( [
  '$rootScope',
  '$sails',
  'i18nService',
  function ( $rootScope, $sails, i18nService ) {
    i18nService.setCurrentLang( 'es' );
    $rootScope.app = {
      name: SAILS_LOCALS.app.name,
      version: SAILS_LOCALS.app.version,
      author: SAILS_LOCALS.app.author,
      conectado: true,
      conectando: false,
      instalando: false,
      canales: function () {
        $sails.get( '/api/v1/account/canales' ).then( ( response ) => {
          console.log( '$GET /api/v1/account/canales->response:', response.data );
        }, ( error ) => {
          console.log( '$GET /api/v1/account/canales->error:', error );
        } );
      }
    };

    if ( SAILS_LOCALS && SAILS_LOCALS.me && SAILS_LOCALS.me.id ) {
      $rootScope.app.usuario = SAILS_LOCALS.me;
    }
    if ( SAILS_LOCALS && SAILS_LOCALS.flashMessages && SAILS_LOCALS.flashType === 'alertify' ) {
      alertifyFlash( SAILS_LOCALS.flashMessages );
    }
  },
] );
