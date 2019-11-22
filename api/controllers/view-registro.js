module.exports = {


  friendlyName: 'View registro',


  description: 'Display "Registro" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/registro'
    }

  },


  fn: async function ( inputs, exits ) {

    // Respond with view.
    return exits.success();

  }


};
