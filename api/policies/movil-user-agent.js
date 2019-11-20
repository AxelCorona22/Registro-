module.exports = function ( req, res, next ) {

  if ( !req.headers['user-agent'] || req.headers['user-agent'] !== sails.config.custom.movilUserAgent ) {
    return res.status( 401 ).send( 'User agent no válido.' );
  }
  { return next(); }
};
