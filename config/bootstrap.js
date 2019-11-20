require( 'dotenv' ).config();

process.on( 'uncaughtException', ( err ) => {
  slackService.post( 'uncaughtException->' + JSON.stringify( err ) );
  console.log( 'Caught exception: ' + err );
} );

module.exports.bootstrap = async function ( done ) {

  if ( sails.config.custom.isTesting && process.env.DB_NAME === sails.config.custom.testingDB ) {
    sails.log( 'PELIGRO **** !!!!! **** !!!! ****' );
    return done( '¡No se puede continuar testing con el mismo nombre de la base de datos configurada por default env(DB_NAME)!' );
  }

  await sails.helpers.loadConfig();
  await sails.helpers.ensureDatabase();

  slackService.post( 'Aplicación inicializada en ' + sails.config.custom.absRoute );

  return done();

};
