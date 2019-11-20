const speakeasy = require( 'speakeasy' );

module.exports = {

  friendlyName: 'Validate mfa',

  description: '',

  inputs: {
    token: {
      type: 'string',
      required: true
    }
  },

  exits: {
    invalidToken: {
      responseType: 'badRequest',
      description: 'Los datos proporcionados no son válidos.',
      extendedDescription: 'Todos los parametros se deben validar antes de ser enviados al servidor.'
    }
  },

  fn: async function ( inputs, exits ) {

    var user = await Usuarios.findOne( { id: this.req.me.id } );

    // Verificar el token
    const success = speakeasy.totp.verify( {
      secret: user.mfa.secret,
      encoding: `base32`,
      window: 1,
      token: inputs.token
    } );

    if ( success ) {
      // cuando todo salio bien, actualizar al usuario
      const mfa = user.mfa;
      mfa.enrolled = true;
      await Usuarios.update( { id: user.id }, { mfa: mfa } ).fetch();
      this.req.session.mfaOk = true;
      this.req.session.mfaPassed = true;
      flashService.success( this.req, 'Verificación de Factor Múltiple' );
      return exits.success();
    } else {
      return exits.invalidToken();
    }
  }
};
