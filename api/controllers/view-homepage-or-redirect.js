module.exports = {


  friendlyName: 'View homepage or redirect',


  description: 'Display or redirect to the appropriate homepage, depending on login status.',


  exits: {

    success: {
      statusCode: 200,
      description: 'Usuario visitante, mostrando home.',
      viewTemplatePath: 'pages/homepage'
    },

    redirect: {
      responseType: 'redirect',
      description: 'Usuario con sesión, mostrando dashboard.'
    }

  },


  fn: async function () {

    if ( this.req.me ) {
      throw { redirect: '/dashboard' };
    }

    return {};

  }


};
