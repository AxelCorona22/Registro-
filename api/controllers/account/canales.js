module.exports = {


  friendlyName: 'Canales',


  description: 'Canales account.',


  inputs: {

  },


  exits: {

  },


  fn: async function ( inputs, exits ) {

    var canales = [];

    // unir a los superadmins a reqmon
    if ( this.req.me && this.req.me.isSuperAdmin ) {
      sails.sockets.join( this.req, 'reqmon' );
      canales.push( 'reqmon' );
    }

    if ( this.req.me && this.req.me.perfilName === 'admin' ) {
      sails.sockets.join( this.req, 'trackerEvents' );
      canales.push( 'trackerEvents' );
    }


    // si no es socket, no hacer nada
    if ( !this.req.isSocket ) { return exits.success(); }

    // unirlo al canal general publico de la app.
    sails.sockets.join( this.req, 'publico' );
    canales.push( 'publico' );
    var profile = {};

    if ( this.req.me ) {
      // unirlo al canal general privado de la app.
      sails.sockets.join( this.req, 'privado' );
      canales.push( 'privado' );
      sails.sockets.join( this.req, this.req.me.perfilName );
      canales.push( this.req.me.perfilName );
      sails.sockets.join( this.req, this.req.me.id );
      canales.push( this.req.me.id );
      profile = {
        id: this.req.me.id,
        fullName: this.req.me.fullName,
        emailAddress: this.req.me.emailAddress,
        permisos: this.req.me.permisos
      };
    }

    return exits.success( { profile,
      canales } );
  }

};
