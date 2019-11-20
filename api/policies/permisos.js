module.exports = async function ( req, res, proceed ) {
  sails.log.silly( 'PermisosPolicy->evaluando:', req.route.path );

  // si es superadmin, puede pasar!.
  if ( req.me.isSuperAdmin ) {
    sails.log.silly( 'PermisosPolicy->paso:Adelante Comandante!', req.route.path );
    return proceed();
  }

  var permisosRequeridos = [];

  // si la ruta no tiene una definicion de permisos...
  if ( typeof sails.config.permisos.routes[req.route.path] === 'undefined' ) {
    sails.log.silly( 'PermisosPolicy->paso:ruta no configurada', req.route.path );
    return proceed();
  }

  // nadie peude entrar, esta en false...
  if ( sails.config.permisos.routes[req.route.path] === false ) {
    sails.log.verbose( 'PermisosPolicy->ruta cerrada:', req.route.path );
    return res.forbidden();
  }

  permisosRequeridos = sails.config.permisos.routes[req.route.path];

  sails.log.silly( 'PermisosPolicy->permisos requeridos', req.route.path, permisosRequeridos );

  // esto no deberia de suceder!, si llegamos hasta aqui es por que hay permisos que valorar!
  // o la ruta en permisos no esta bien definida, debe ser un array!
  if ( !permisosRequeridos ) {
    sails.log.silly( 'PermisosPolicy->paso:sin definicion', req.route.path );
    return proceed();
  }

  // #TODOS: validar que...
  //  permisosRequeridos sea un array
  //  que tenga por lo menos 1 elemento
  //  y los elementos que tenga, todos sean tipo string


  // valorar, tiene o no por lo menos uno de los permisos requeridos
  if ( _.intersection( permisosRequeridos, req.me.permisos ).length > 0 ) {
    sails.log.silly( 'PermisosPolicy->paso:autorizado', req.route.path );
    return proceed();
  }

  sails.log.verbose( 'PermisosPolicy->no pasó', req.route.path, 'requiere:', permisosRequeridos );
  // si llegamos hasta aqui, no puede pasar!
  return res.forbidden( 'forbidden|policy', 'No tiene permiso' );
};
