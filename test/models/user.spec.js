/* eslint-disable max-nested-callbacks*/
const expect = require( 'chai' ).expect;
/**
 * Probar que exista el usuario super@snell.com.mx
 */
describe( '⚡ Crear usuario para pruebas', () => {
  it( '⚇ Debe regresar 1 user', async ( ) => {

    var password = await sails.helpers.passwords.hashPassword( sails.config.custom.firstPassword );
    // nos aseguramos que no exista primero
    var existe = await Usuarios.findOne( { emailAddress: testEmail } );
    if ( existe ) {
      await Logsistema.destroy( { usuario: existe.id } );
      await Usuarios.destroy( { id: existe.id } );
    }
    var uSuario = await Usuarios.create( {
      permisos: [],
      emailAddress: testEmail,
      authorized: true,
      activo: true,
      fullName: 'Tester de Sistema',
      isSuperAdmin: true,
      perfilName: 'super',
      password: password
    } ).fetch();
    expect( uSuario ).to.have.property( 'id' );
    expect( uSuario ).to.have.property( 'perfilName' ).to.equal( 'super' );
    testUser = uSuario;
  } );
} );

describe( '⚡ Verificar que existe el usuario de pruebas', () => {
  it( '⚇ Debe regresar 1 user', async ( ) => {
    var uSuario = await Usuarios.findOne( { emailAddress: testEmail } );

    expect( uSuario ).to.have.property( 'id' );
    expect( uSuario ).to.have.property( 'perfilName' ).to.equal( 'super' );
  } );
} );
