module.exports = {
  attributes: {
    nombre: {
      type: 'string',
      required: true
    },
    categoria: {
      type: 'string',
      required: true
    },
    descripcion: {
      type: 'string',
      defaultsTo: ''
    },
    valor: {
      type: 'string',
      required: true
    },
    estatus: {
      type: 'boolean',
      defaultsTo: true
    }
  }
};
