const expect = require( 'chai' ).expect;
describe( '⚡ Eliminar el usuario de pruebas', async () => {
  it( '⚇ Debe regresar 1 user', async ( ) => {
    var logs = await Logsistema.destroy( { usuario: testUser.id } ).fetch();
    expect( logs ).to.be.an( 'array' );
    var user = await Usuarios.destroy( { emailAddress: testEmail } ).fetch();
    expect( user ).to.be.an( 'array' ).to.have.lengthOf( 1 );
  } );
} );
