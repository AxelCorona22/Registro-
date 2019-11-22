module.exports = {


  friendlyName: 'Guardar',


  description: 'Guardar alumnos.',


  inputs: {
    nick: {
      type: 'string',
      required: true
    },
    fullName: {
      type: 'string',
      required: true
    },
    emailAddress: {
      type: 'string',
      required: true,
      isEmail: true
    },
    celular: {
      type: 'string'
    },
    password: {
      type: 'string',
      required: true
    },
    password2: {
      type: 'string',
      required: true
    }

  },


  exits: {
    existe: {
      responseCode: '500'
    },
    password: {
      responseCode: '500'
    }
  },


  fn: async function ( inputs, exits ) {
    // asegurarse que el password es igual a password2
    if ( inputs.password !== inputs.password2 ) {
      return exits.password( 'Las contraseñas no coinciden' );
    }

    // asegurarse que el email viene en minusculas
    inputs.emailAddress = inputs.emailAddress.toLowerCase();

    // asegurarse que no exita ese email registrado.
    var existe = await Alumnos.findOne( {
      emailAddress: inputs.emailAddress
    } );

    if ( existe ) {
      return exits.existe( 'Dirección de correo registrada previamente.' );
    }
    // almacenar usuario
    const nuevoAlumno = await Alumnos.create( inputs ).fetch();
    sails.log( 'alumno creado', nuevoAlumno );
    // retornar resultado al front
    return exits.success( nuevoAlumno );

  }


};
