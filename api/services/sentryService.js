const Sentry = require( '@sentry/node' );
if ( sails.config.custom.sentryNode ) {
  Sentry.init( { dsn: sails.config.custom.sentryNode } );
  sails.log.info( '★ Sentry Node Activado...' );
}
module.exports.captureMessage = function ( msg ) {
  if ( !sails.config.custom.sentryNode ) { return; }
  return Sentry.captureMessage( msg );
};
