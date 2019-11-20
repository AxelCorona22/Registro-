module.exports.permisos = {
  routes: {

    /*
     █████  ██████  ███    ███ ██ ███    ██
    ██   ██ ██   ██ ████  ████ ██ ████   ██
    ███████ ██   ██ ██ ████ ██ ██ ██ ██  ██
    ██   ██ ██   ██ ██  ██  ██ ██ ██  ██ ██
    ██   ██ ██████  ██      ██ ██ ██   ████
    */
    // CONFIGURACION
    '/admin/configuracion': [ 'configuracion', ],
    '/api/v1/admin/configuracion/save': [ 'configuracion', ],
    // LOGSISTEMA
    '/admin/logsistema': [ 'logsistema', ],
    '/api/v1/admin/logsistema/get': [ 'logsistema', ],
    // PERFILES
    '/admin/perfiles': [ 'ver_perfiles', ],
    '/api/v1/admin/perfiles/get': [ 'ver_perfiles', ],
    '/api/v1/admin/perfiles/save': [ 'crear_perfiles', ],
    // PERMISOS
    '/admin/permisos': [ 'ver_permisos', ],
    '/api/v1/admin/permisos/get': [ 'ver_permisos', ],
    '/api/v1/admin/permisos/getall': [ 'ver_permisos', ],
    '/api/v1/admin/permisos/save': [ 'editar_permisos', ],
    // USERS
    '/admin/users': [ 'ver_usuarios', ],
    '/api/v1/admin/users/getall': [ 'ver_usuarios', ],
    '/api/v1/admin/users/save': [ 'editar_usuarios', ],
    '/api/v1/admin/users/toogle-permiso': [ 'editar_usuarios', ],

    '/admin/reqmon': false // denegada para todo mundo, pero recordemos que la policy deja pasar a isSuperAdmin:true ;)

  }
};
