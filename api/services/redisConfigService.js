var util = require( 'util' );
// Servicio de caché para la configuración
// datastores.redis debe estar definido
module.exports = {
  get: async function () {
    if ( !sails.config.datastores.redis ) { return false; }
    return new Promise( async ( resolve, reject ) => {
      await sails.getDatastore( 'redis' ).leaseConnection( async ( db ) => {
        var redisConfig = await ( util.promisify( db.get ).bind( db ) )( 'config' );

        try {
          redisConfig = JSON.parse( redisConfig );
        } catch ( e ) { return ( reject( e ) ); }
        if ( redisConfig && redisConfig.config ) {
          return resolve( redisConfig.config );
        }
        // no hay config!
        return resolve( false );
      } ); // get
    } );
  },
  set: async function ( value ) {
    var data = {
      config: value
    };
    var expiresIn = 1000 * 60 * 60 * 24 * 360; // válido por 1 año!
    var ttlInSeconds = Math.ceil( expiresIn / 1000 );

    return new Promise( async ( resolve, reject ) => {
      if ( !sails.config.datastores.redis ) { return resolve( false ); }
      await sails.getDatastore( 'redis' ).leaseConnection( async ( db ) => {
        var done = await ( util.promisify( db.setex ).bind( db ) )( 'config', ttlInSeconds, JSON.stringify( data ) );
        if ( done !== 'OK' ) {
          return reject( undefined );
        } else {
          return resolve( done );
        }
      } );
    } );
  }
};
