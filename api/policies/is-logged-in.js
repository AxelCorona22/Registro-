/**
 * is-logged-in
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function ( req, res, proceed ) {
  // If `req.me` is set, then we know that this request originated
  // from a logged-in user.  So we can safely proceed to the next policy--
  // or, if this is the last policy, the relevant action.
  // > For more about where `req.me` comes from, check out this app's
  // > custom hook (`api/hooks/custom/index.js`).
  if ( req.me ) {
    if ( req.me.clearPassword ) {
      if ( req.url === '/account/password' || req.url === '/api/v1/account/update-password' ) {
        return proceed();
      } else {
        flashService.warning( req, 'Debe cambiar su contraseña.' );
        return res.redirect( '/account/password' );
      }
    } else {
      if ( !req.me.tos ) {
        if ( req.url === '/account/tos' || req.url === '/api/v1/account/accept-tos' ) {
          return proceed();
        } else {
          flashService.warning( req, 'Debe aceptar los terminos de uso del servicio.' );
          return res.redirect( '/account/tos' );
        }
      }
      return proceed();
    }
  }

  // --•
  // Otherwise, this request did not come from a logged-in user.
  sails.log.verbose( 'policy:is-logged-in->denied' );
  return res.unauthorized();

};
