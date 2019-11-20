var generator = require( 'generate-password' );
module.exports = {
  friendlyName: 'Save',
  description: 'Save users.',
  inputs: {
    id: {
      type: 'string'
    },
    perfilName: {
      type: 'string'
    },
    fullName: {
      type: 'string',
      required: true
    },
    celular: {
      type: 'string'
    },
    emailAddress: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: false
    },
    activo: {
      type: 'boolean'
    },
    movilAccess: {
      type: 'boolean'
    }
  },
  exits: {
    success: {
      description: 'El user fue guardado correctamente.'
    }
  },
  fn: async function ( inputs, exits ) {
    var user = inputs;
    var registro;
    var empresa;

    if ( this.req.me.empresa && this.req.me.empresa.id ) {
      empresa = this.req.me.empresa.id;
    }

    if ( user.password ) {
      var hashed = await sails.helpers.passwords.hashPassword( user.password );
      user.clearPassword = user.password;
      user.password = hashed;
    }
    if ( inputs.id ) {
      const id = user.id;
      delete user.id;
      registro = await Usuarios.update( { id: id }, user ).fetch();
      if ( !registro || !registro.length ) {
        return exits.error( new Error( 'No existe el registro' ) );
      }
      registro = registro[0];
    } else {
      var perfil = await Perfiles.findOne( { nombre: inputs.perfilName } );
      if ( perfil ) {
        user.permisos = perfil.permisos;
        user.perfil = perfil.id;
      }
      if ( !user.password ) {
        user.clearPassword = generator.generate( { length: 8,
          numbers: true,
          uppercase: false } );
        user.password = await sails.helpers.passwords.hashPassword( user.clearPassword );
      }
      user.empresa = empresa;
      registro = await Usuarios.create( user ).fetch();
      if ( !registro ) { return exits.error(); }
    }
    var retoraUser = await Usuarios.findOne( { id: registro.id } ).populate( 'perfil' );
    return exits.success( retoraUser );
  }
};
