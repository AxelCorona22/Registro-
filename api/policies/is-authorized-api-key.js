/**
 * is-authorized-api-key
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function ( req, res, proceed ) {

  if ( !req.headers['api-key'] ) {
    return res.unauthorized( 'api-key', 'Falta api-key en su solicitud.' );
  }

  if ( req.headers['api-key'] === sails.config.security.apiKey ) {
    return proceed();
  }
  sails.log.verbose( 'policy:is-authorized-api-key->!api-key' );
  // --•
  // Otherwise, this request did not come from a logged-in user.
  return res.unauthorized( 'api-key', 'Api key no reconocida.' );

};
