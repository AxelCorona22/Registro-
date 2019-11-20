/**
 * Production environment settings
 * (sails.config.*)
 *
 * What you see below is a quick outline of the built-in settings you need
 * to configure your Sails app for production.  The configuration in this file
 * is only used in your production environment, i.e. when you lift your app using:
 *
 * ```
 * NODE_ENV=production node app
 * ```
 *
 * > If you're using git as a version control solution for your Sails app,
 * > this file WILL BE COMMITTED to your repository by default, unless you add
 * > it to your .gitignore file.  If your repository will be publicly viewable,
 * > don't add private/sensitive data (like API secrets / db passwords) to this file!
 *
 * For more best practices and tips, see:
 * https://sailsjs.com/docs/concepts/deployment
 */

require( 'dotenv' ).config();

const port = '1333';
var domains;
if ( process.env.ALLOWED_DOMAINS ) {
  domains = process.env.ALLOWED_DOMAINS.split( ',' ).map( el => el.trim().toLowerCase() );
}
module.exports = {

  hookTimeout: 30000,

  models: {
    migrate: 'safe',
    cascadeOnDestroy: false
  },

  blueprints: {
    shortcuts: false
  },

  security: {
    cors: {
      allowOrigins: process.env.ALLOWED_DOMAINS.split( ',' ).map( el => el.trim().toLowerCase() )
    }
  },

  log: {
    level: process.env.LOG_LEVEL || 'verbose'
  },

  http: {
    cache: 365.25 * 24 * 60 * 60 * 1000, // One year
    trustProxy: true
  },

  sockets: {
    beforeConnect: function ( handshake, proceed ) {
      sails.log.silly( '·• Socket Nuevo: ', handshake.headers['sec-websocket-key'] );
      if (
        domains.indexOf( handshake.headers.origin ) > -1
      ) {
        return proceed( undefined, true );
      } else if ( handshake.headers.origin === 'file://' ) {
        // cuando es de file (android cordova app), el user agent debe coincidir
        if ( handshake.headers['user-agent'] && handshake.headers['user-agent'] === sails.config.custom.userAgentString ) {
          return proceed( undefined, true );
        } else {
          return proceed( 'Unknown Origin (user-agent)', false );
        }
      }
      return proceed( '???' );
    //
    //   // `true` allows the socket to connect.
    //   // (`false` would reject the connection)
    //   return proceed(undefined, true);
    //
    },
    afterDisconnect: function ( session, socket, done ) {
      sails.log.silly( '•· Socket Desconectado: ', socket.id );
      return done();
    //
    //   // By default: do nothing.
    //   // (but always trigger the callback)
    //   return done();
    //
    }
  },
  port: port


};
