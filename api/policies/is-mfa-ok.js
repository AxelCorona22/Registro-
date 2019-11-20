module.exports = async function ( req, res, proceed ) {

  if ( req.session.mfaOk ) {
    return proceed();
  }

  // almacenamos a donde queria ir...
  req.session.originalUrl = req.originalUrl;

  if ( req.wantsJSON || req.isSocket ) {
    return res.status( 403 ).json( { error: 'MFA is required.' } );
  }

  res.redirect( '/account/validate-mfa' );

};
