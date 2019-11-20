/* eslint-disable max-lines*/
module.exports.colecciones = {
  permisos: [
    // User
    { nombre: 'Ver Usuarios',
      valor: 'ver_usuarios',
      categoria: 'Usuarios' },
    { nombre: 'Editar Usuarios',
      valor: 'editar_usuarios',
      categoria: 'Usuarios' },
    { nombre: 'Crear Usuarios',
      valor: 'crear_usuarios',
      categoria: 'Usuarios' },
    // Perfiles
    { nombre: 'Ver Perfiles',
      valor: 'ver_perfiles',
      categoria: 'Perfiles' },
    { nombre: 'Editar Perfiles',
      valor: 'editar_perfiles',
      categoria: 'Perfiles' },
    { nombre: 'Crear Perfiles',
      valor: 'crear_perfiles',
      categoria: 'Perfiles' },
    // Permisos
    { nombre: 'Ver Permisos',
      valor: 'ver_permisos',
      categoria: 'Permisos' },
    { nombre: 'Editar Permisos',
      valor: 'editar_permisos',
      categoria: 'Permisos' },
    { nombre: 'Crear Permisos',
      valor: 'crear_permisos',
      categoria: 'Permisos' },

    { nombre: 'Configuracion',
      valor: 'configuracion',
      categoria: 'Admin' },
    { nombre: 'Log Sistema',
      valor: 'logsistema',
      categoria: 'Admin' },

  ],
  perfiles:
  [
    { nombre: 'super',
      descripcion: 'El Todo Poderoso',
      permisos: [],
      visible: false },
    { nombre: 'admin',
      descripcion: 'Administrador de Sistema',
      permisos: [
        'configuracion',
        'logsistema',
        'ver_perfiles',
        'crear_perfiles',
        'editar_perfiles',
        'ver_permisos',
        'crear_permisos',
        'editar_permisos',
        'ver_usuarios',
        'crear_usuarios',
        'editar_usuarios',
      ] },
    { nombre: 'compras',
      descripcion: 'Encargado de Compras',
      permisos: [] },
    { nombre: 'direccion',
      descripcion: 'Directivo de Empresa',
      permisos: [] },
    { nombre: 'residente',
      descripcion: 'Residente de Obra',
      permisos: [] },
    { nombre: 'almacenista',
      descripcion: 'Encargado de Almacén',
      permisos: [] },
    { nombre: 'administracion',
      descripcion: 'Encargado de Administración',
      permisos: [] },
  ]
};
