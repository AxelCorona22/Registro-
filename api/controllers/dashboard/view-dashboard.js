module.exports = {


  friendlyName: 'View welcome page',


  description: 'Display the dashboard "Welcome" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/dashboard',
      description: 'Desplegando dashboard a usuarios autenticados.'
    }

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
