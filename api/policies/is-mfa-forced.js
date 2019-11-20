module.exports = async function ( req, res, proceed ) {

  if ( req.session.mfaPassed ) {
    return proceed();
  }

  const msg = 'Su cuenta no es lo suficientemente segura para efectuar esa operación';
  if ( req.wantsJSON || req.isSocket ) {
    return res.status( 403 ).send( msg );
  }
  sails.log.verbose( 'policy:is-mfa-forced->denied' );
  return res.forbidden( msg );

};
