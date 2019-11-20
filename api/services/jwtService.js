var jwt = require( 'jsonwebtoken' );
require( 'dotenv' ).config();
// With this method we generate a new token based on payload we want to put on it
module.exports.issue = function ( payload ) {
  return jwt.sign(
    payload, // This is the payload we want to put inside the token
    sails.config.custom.jwtSecret, // Secret string which will be used to sign the token
    {
      expiresIn: process.env.JWT_EXPIRATION || '8h'
    }
  );
};

// Here we verify that the token we received on a request hasn't be tampered with.
module.exports.verify = function ( token, verified ) {
  return jwt.verify(
    token,
    sails.config.custom.jwtSecret,
    {},
    verified
  );
};

module.exports.decode = function ( token ) {
  return jwt.decode( token, { complete: true } );
};
