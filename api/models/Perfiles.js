module.exports = {
  attributes: {
    nombre: {
      type: 'string',
      required: true,
      unique: true,
      maxLength: 50,
      description: 'Nombre del permiso que se le puede aplicar a un usuario',
      example: 'admin'
    },
    permisos: {
      type: 'ref',
      required: false,
      defaultsTo: [],
      description: 'Lista de permisos que da el permiso al usuario al momento que se crea',
      example: [
        'borrarUsuarios',
        'crearPermisos',
      ]
    },
    descripcion: {
      type: 'string',
      required: true
    },
    visible: {
      type: 'boolean',
      defaultsTo: true
    }
  }
};
