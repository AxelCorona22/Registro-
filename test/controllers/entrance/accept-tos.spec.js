/* eslint-disable max-nested-callbacks*/
/**
 * Verificar que el usuario pueda iniciar sesion
 *
 * usa:
 *    supertest:    Se inicializa aqui, es una global que viene desde lifecycle.test.js
 *    autenticado:  Se instancia aqui despues de hacer el login, tambien es global y conserva la sesion del login.
 *                  se usará en adelante para las solicitudes que deban llevar sesión.
 *                  Este sería el mismo procedimiento para probar cualquier funcionalidad de otros usuarios.
 *                  para lo cual primero se tendria que hacer logout y repetir el procedimiento.
 */
const expect = require( 'chai' ).expect;
describe( '⚡ Aceptar TOS', () => {
  it( '⚇ Debe regresar un codigo 200 con un array de 1.', ( done ) => {
    autenticado
        .post( '/api/v1/account/accept-tos' )
        .expect( 'Content-Type', /json/ )
        .expect( 200 ) // debe regresar un 200
        .end( ( err, res ) => {
          if ( err ) { return done( err ); }
          expect( res.body ).to.be.an( 'array' ).to.have.lengthOf( 1 );
          return done();
        } );
  } );
} );
