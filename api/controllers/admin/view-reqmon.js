module.exports = {


  friendlyName: 'View reqmon',


  description: 'Display "Reqmon" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/admin/reqmon'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
