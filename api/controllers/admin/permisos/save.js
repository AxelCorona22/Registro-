module.exports = {


  friendlyName: 'Guardar',
  description: 'Guardar permisos.',
  inputs: {
    permiso: {
      type: 'json',
      required: true
    }

  },
  exits: {

  },

  fn: async function ( inputs, exits ) {

    var permiso;
    if ( inputs.permiso.id ) {
      var id = inputs.permiso.id;
      delete inputs.permiso.id;
      permiso = await Permisos.update( { id: id }, inputs.permiso ).fetch();
      permiso = permiso[0];
    } else {
      permiso = await Permisos.create( inputs.permiso ).fetch();
    }

    return exits.success( permiso );
  }


};
