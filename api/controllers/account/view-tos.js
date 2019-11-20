module.exports = {


  friendlyName: 'View tos',


  description: 'Display "Tos" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/account/tos'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
