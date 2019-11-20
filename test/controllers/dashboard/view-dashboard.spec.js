/* eslint-disable no-unused-vars*/
/**
 * Verificar que el usuario pueda accesar al dashboard (debe hacer login primero)
 *
 * usa: autenticado
 */
var should = require( 'chai' ).should();
describe( '⚡ GET /dashboard', () => {
  it( '⚇ Debe regresar un codigo 302 y redireccionar a /account/tos.', ( done ) => {
    autenticado
      .get( '/dashboard' )
      .expect( 302 )
      .end( ( err, res ) => {
        if ( err ) {
          console.log( 'Error al obtener /dashboard:', err );
          return done( err );
        }
        res.header['location'].should.include( '/account/tos' );
        return done();

      } );
  } );
} );
