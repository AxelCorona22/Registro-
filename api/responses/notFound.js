/**
 * notFound.js
 *
 * A custom response that content-negotiates the current request to
 *  send back 404 (Not Found) with no response body.
 *
 * Example usage:
 * ```
 *     return res.notFound();
 * ```
 */
var forwarded = require( 'forwarded-for' );
module.exports = function notFound ( message ) {

  var req = this.req;
  var res = this.res;


  var address = forwarded( req, req.headers );
  sails.log.verbose( 'Ran custom response: res.notFound():', req.originalUrl, address.ip, req.headers['user-agent'] );

  if ( req.wantsJSON ) {
    return res.sendStatus( 404 );
  } else {
    return res.status( 404 ).view( '404', {
      layout: 'layouts/layout',
      locals: {
        message: message,
        app: sails.config.custom.app,
        _environment: sails.config.environment,
        me: req.me,
        invitarMultiFactor: false,
        deploy: sails.config.opciones.deploy
      }
    } );
  }

};
