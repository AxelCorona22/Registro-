require( 'dotenv' ).config();
let sockets = {
  transports: [ 'websocket', ],

  beforeConnect: function ( handshake, proceed ) {
    sails.log.silly( '·• Socket Nuevo: ', handshake.headers['sec-websocket-key'] );
    return proceed( undefined, true );
  },

  afterDisconnect: function ( session, socket, done ) {
    sails.log.silly( '•· Socket Desconectado: ', socket.id );
    return done();
  }

  /** *************************************************************************
  *                                                                          *
  * Whether to expose a 'GET /__getcookie' route that sets an HTTP-only      *
  * session cookie.                                                          *
  *                                                                          *
  ***************************************************************************/

  // grant3rdPartyCookie: true,
};

if ( process.env.REDIS_HOST && process.env.REDIS_PORT && process.env.REDIS_DB ) {
  sockets.adapter = '@sailshq/socket.io-redis';
  sockets.adapterOptions = {
    onRedisDisconnect: function () {
      sails.hooks.panico.panic();
    },
    onRedisReconnect: function () {
      sails.hooks.panico.chill();
    }
  };
  if ( process.env.REDIS_AUTH ) {
    sockets.url = `redis://:${process.env.REDIS_AUTH}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`;
  } else {
    sockets.url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`;
  }
}
module.exports.sockets = sockets;
