module.exports = {


  friendlyName: 'Refresh data',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function ( inputs, exits ) {
    let usuario = this.req.me;

    if ( usuario && usuario.perfilName && usuario.perfilName === 'director' ) {
      return exits.success( { dashboard: await sails.helpers.getDashboard() } );
    } else {
      return exits.success();
    }
  }


};
