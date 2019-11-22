/* eslint-disable key-spacing,object-property-newline */
/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /*
  ██████  ██    ██ ██████  ██      ██  ██████  ██████
  ██   ██ ██    ██ ██   ██ ██      ██ ██      ██    ██
  ██████  ██    ██ ██████  ██      ██ ██      ██    ██
  ██      ██    ██ ██   ██ ██      ██ ██      ██    ██
  ██       ██████  ██████  ███████ ██  ██████  ██████
  */
  // views
  'GET  /': {
    action: 'view-homepage-or-redirect'
  },
  'GET  /nosotros': {
    action: 'view-nosotros'
  },
  'GET  /contacto': {
    action: 'view-contacto'
  },
  'GET  /privacidad': {
    action: 'view-privacidad'
  },
  'GET  /terminos': {
    action: 'view-terminos'
  },
  'GET  /login': {
    action: 'entrance/view-login'
  },
  'GET  /email/confirm': {
    action: 'entrance/confirm-email'
  },
  'GET  /email/confirmed': {
    view: 'pages/entrance/confirmed-email'
  },
  'GET  /password/forgot': {
    action: 'entrance/view-forgot-password'
  },
  'GET  /password/new': {
    action: 'entrance/view-new-password'
  },
  'GET  /vision': {
    action: 'view-vision'
  },


  // api
  'PUT  /api/v1/entrance/login': {
    action: 'entrance/login',
    csrf: false
  },
  'POST /api/v1/entrance/send-password-recovery-email': {
    action: 'entrance/send-password-recovery-email'
  },
  'POST /api/v1/entrance/update-password-and-login': {
    action: 'entrance/update-password-and-login'
  },
  'POST /api/v1/deliver-contact-form-message': {
    action: 'deliver-contact-form-message'
  },
  /*
   █████   ██████  ██████  ██████  ██    ██ ███    ██ ████████
  ██   ██ ██      ██      ██    ██ ██    ██ ████   ██    ██
  ███████ ██      ██      ██    ██ ██    ██ ██ ██  ██    ██
  ██   ██ ██      ██      ██    ██ ██    ██ ██  ██ ██    ██
  ██   ██  ██████  ██████  ██████   ██████  ██   ████    ██
  */
  // views
  'GET  /dashboard': {
    action: 'dashboard/view-dashboard'
  }, // PERMISO[NA]
  'GET  /account': {
    action: 'account/view-account-overview'
  }, // PERMISO[NA]
  'GET  /account/password': {
    action: 'account/view-edit-password'
  }, // PERMISO[NA]
  'GET  /account/profile': {
    action: 'account/view-edit-profile'
  }, // PERMISO[NA]
  'GET  /account/multifactor': {
    action: 'account/view-multifactor'
  }, // PERMISO[NA]
  'GET  /account/validate-mfa': {
    view: 'pages/account/validate-mfa'
  }, // PERMISO[NA]

  // api
  'GET /api/v1/dashboard/refresh-data': {
    action: 'dashboard/refresh-data'
  }, // PERMISO[NA]

  // api
  '/api/v1/account/logout': {
    action: 'account/logout'
  }, // PUBLIC
  '/logout': '/api/v1/account/logout', // ??????
  'PUT  /api/v1/account/update-password': {
    action: 'account/update-password'
  }, // ??????
  'PUT  /api/v1/account/update-profile': {
    action: 'account/update-profile'
  }, // ??????
  'PUT  /api/v1/account/validate-mfa': {
    action: 'account/validate-mfa'
  }, // ??????
  'PUT  /api/v1/account/disable-mfa': {
    action: 'account/disable-mfa'
  }, // ??????
  'GET  /api/v1/account/canales': {
    action: 'account/canales'
  }, // PERMISO[NA]
  'GET  /api/v1/account/:id/photo': {
    action: 'account/download-photo',
    skipAssets: false
  }, // ??????
  'POST /api/v1/account/update-profile-picture': {
    action: 'account/update-profile-picture'
  }, // ??????
  'POST /api/v1/account/remove-profile-picture': {
    action: 'account/remove-profile-picture'
  }, // ??????

  /*
   █████  ██████  ███    ███ ██ ███    ██
  ██   ██ ██   ██ ████  ████ ██ ████   ██
  ███████ ██   ██ ██ ████ ██ ██ ██ ██  ██
  ██   ██ ██   ██ ██  ██  ██ ██ ██  ██ ██
  ██   ██ ██████  ██      ██ ██ ██   ████
  */
  'GET /admin/logsistema': {
    action: 'admin/logsistema/view-logsistema'
  }, // PROTEGIDO
  'POST /api/v1/admin/logsistema/get': {
    action: 'admin/logsistema/get'
  }, // PROTEGIDO
  // PERFILES
  'GET  /admin/perfiles': {
    action: 'admin/perfiles/view-perfiles'
  }, // PROTEGIDO
  'GET  /api/v1/admin/perfiles/get': {
    action: 'admin/perfiles/get'
  }, // PROTEGIDO
  'POST /api/v1/admin/perfiles/save': {
    action: 'admin/perfiles/save'
  }, // PROTEGIDO
  // PERMISOS
  'GET  /admin/permisos': {
    action: 'admin/permisos/view-permisos'
  }, // PROTEGIDO
  'GET  /api/v1/admin/permisos/get': {
    action: 'admin/permisos/get'
  }, // PROTEGIDO
  'POST  /api/v1/admin/permisos/getall': {
    action: 'admin/permisos/getall'
  }, // PROTEGIDO
  'POST /api/v1/admin/permisos/save': {
    action: 'admin/permisos/save'
  }, // PROTEGIDO
  // USERS
  'GET  /admin/usuarios': {
    action: 'admin/usuarios/view-usuarios'
  }, // PROTEGIDO
  'POST /api/v1/admin/usuarios/getall': {
    action: 'admin/usuarios/getall'
  }, // PROTEGIDO
  'POST /api/v1/admin/usuarios/save': {
    action: 'admin/usuarios/save'
  }, // PROTEGIDO
  'POST /api/v1/admin/usuarios/toogle-permiso': {
    action: 'admin/usuarios/toogle-permiso'
  }, // PROTEGIDO

  // REQMON (hooks)
  'GET  /admin/reqmon': {
    action: 'admin/view-reqmon'
  },

  /*
  ███████ ███████  ██████ ██    ██ ██████  ██ ████████ ██    ██
  ██      ██      ██      ██    ██ ██   ██ ██    ██     ██  ██
  ███████ █████   ██      ██    ██ ██████  ██    ██      ████
       ██ ██      ██      ██    ██ ██   ██ ██    ██       ██
  ███████ ███████  ██████  ██████  ██   ██ ██    ██       ██
  */

  'GET  /csrftoken': {
    action: 'security/grant-csrf-token'
  },

  /*
    ████████  ██████  ███████
       ██    ██    ██ ██
       ██    ██    ██ ███████
       ██    ██    ██      ██
       ██     ██████  ███████
    */

  'GET  /account/tos': {
    action: 'account/view-tos'
  },
  'POST /api/v1/account/accept-tos': {
    action: 'account/accept-tos',
    csrf: false
  },
  /*
  ██████  ███████  ██████  ██ ███████ ████████ ██████   ██████
  ██   ██ ██      ██       ██ ██         ██    ██   ██ ██    ██
  ██████  █████   ██   ███ ██ ███████    ██    ██████  ██    ██
  ██   ██ ██      ██    ██ ██      ██    ██    ██   ██ ██    ██
  ██   ██ ███████  ██████  ██ ███████    ██    ██   ██  ██████
  */
  'GET /registro': {
    action: 'view-registro'
  },
  'POST /api/v1/alumnos': {
    action: 'alumnos/guardar'
  }
};
