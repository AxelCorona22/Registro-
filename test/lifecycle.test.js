/* eslint-disable no-unused-vars*/


var Sails = require( 'sails' ).constructor;
var sailsApp = new Sails();
var supertest;
var agent;
var autenticado;
var testUser;
var csrfToken;
var testEmail;
/**
 * Este archivo inicializa sails para ejecutar las pruebas en el orden establecido por main.test.js
 */

before( function ( done ) {
  console.log( '⛵ Preparando entorno de pruebas SailsJS...' );

  // Increase the Mocha timeout so that Sails has enough time to lift, even if you have a bunch of assets.
  this.timeout( 10000 );

  sailsApp.lift( {
    hooks: {
      grunt: false, // vamos a probar el api, no levantamos las tareas.
      apianalytics: false // no levantamos este hook
    },
    log: { level: 'error' } // solo mostrar error y warning
  }, ( err ) => {
    if ( err ) {
      sails.log.warn( '☠️ Error al inicializar el entorno de pruebas SailsJS', err );
      return done( err );
    }
    console.log( '🔴 Entorno de pruebas SailsJS iniciado!' );
    console.log();
    return done();
  } );
} );

after( ( done ) => {
  console.log( '⛵ Finalizando entorno de pruebas SailsJS...' );
  sails.lower( ( err ) => {
    if ( err ) {
      sails.log.warn( '☠️ Error al finalizar el entorno de pruebas SailsJS: ', err );
      return done( err );
    }
    console.log( '⚪ Entorno de pruebas SailsJS finalizado!' );
    return done();
  } );
} );
