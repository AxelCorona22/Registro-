module.exports = {


  friendlyName: 'Disable mfa',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function ( inputs, exits ) {

    await Usuarios.update( { id: this.req.me.id }, { mfa: { enrolled: false } } ).fetch();
    this.req.session.mfaPassed = false;
    return exits.success();

  }


};
