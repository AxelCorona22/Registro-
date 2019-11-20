var fs = require( 'fs' );

module.exports = {


  friendlyName: 'Remove profile picture',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function ( inputs, exits ) {
    var user = await Usuarios.findOne( { id: this.req.me.id } );

    // borrar el archivo.
    fs.unlinkSync( user.imageUploadFd );

    // actualizar db
    await Usuarios.update( { id: this.req.me.id }, {
      imageUploadFd: '',
      imageUploadMime: '',
      picture: false
    } ).fetch();

    flashService.success( this.req, 'La imagen de su perfil ha sido removida.' );

    return exits.success();

  }


};
