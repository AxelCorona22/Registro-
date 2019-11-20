module.exports = async function ( req, res, next ) {

  sails.log.silly( 'JWTPolicy->evaluando ruta:', req.route.path );

  // si la ruta no es de api lo dejamos pasar.
  if ( req.route.path.indexOf( '/api/v1/movil' ) === -1 ) {
    return next();
  }

  if ( !req.headers.authorization ) {
    sails.log.verbose( 'policy:jwt->!jwt' );
    return res.status( 401 ).send( 'authorization header required' );
  }

  try {
    const token = req.headers.authorization.split( ' ' )[1];
    var valid = jwtService.verify( token );
  } catch ( err ) {
    sails.log( 'Error al verificar token:', err );
  }

  if ( !valid || !valid.id ) {
    sails.log.verbose( 'policy:jwt->jwt!valid' );
    return res.status( 401 ).send( 'Sesión jwt no válida.' );
  }

  var loggedInUser = await Usuarios.findOne( { id: valid.id } );

  if ( !loggedInUser ) { // el usuario no existe mas...
    sails.log.verbose( 'policy:jwt->!jwt' );
    return res.status( 401 ).send( 'Sesión jwt no válida.' );
  }

  // si aun no tenemos identidad de la solicitud...
  if ( !req.me ) {
    var sanitizedFields = [
      'password',
      'passwordResetToken',
      'passwordResetTokenExpiresAt',
      'emailProofToken',
      'emailProofTokenExpiresAt',
    ];
    req.me = _.omit( loggedInUser, sanitizedFields );
    sails.log.silly( 'Identidad de solicitud creada en policy jwt.', req.me );
  } else {
    sails.log.silly( 'Identidad de solicitud NO creada', req.me );
  }

  return next();
};
