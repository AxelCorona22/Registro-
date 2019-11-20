module.exports = {


  friendlyName: 'Accept tos',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function ( inputs, exits ) {

    return exits.success( await Usuarios.update( { id: this.req.me.id }, { tos: true } ).fetch() );

  }


};
