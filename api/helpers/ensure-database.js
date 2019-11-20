const moment = require( 'moment' );
const fs = require( 'fs' );
require( 'dotenv' ).config();
module.exports = {
  friendlyName: 'Ensure collections',
  description: '',
  inputs: {},
  exits: {
    success: {
      description: 'All done.'
    }
  },

  fn: async function ( inputs, exits ) {

    // si la base de datos no contiene las tablas que requerimos... crearlas!
    // por el momento solo probamos con una, [dbo].[usuarios], si esta no existe, posiblemente ninguna,
    const resultTablas = await Usuarios.getDatastore().sendNativeQuery( `SELECT table_name FROM information_schema.tables WHERE table_schema='dbo' and TABLE_NAME='usuarios';` );
    if ( !resultTablas || !resultTablas.recordset || !resultTablas.recordset.length ) { // no existe la tabla usuarios...
      sails.log.verbose( '◊ Generando estructura de base de datos...' );
      await Usuarios.getDatastore().sendNativeQuery( Buffer.from( fs.readFileSync( `database/${process.env.MSSQL_DB}.sql` ) ).toString() );
    }

    if ( !await Perfiles.count() ) {
      sails.log.verbose( '◊ Generando perfiles.' );
      await Perfiles.createEach( sails.config.colecciones.perfiles );
    }

    // verificar que existan los permisos que usamos
    if ( await Permisos.count() === 0 ) {
      sails.log.verbose( '◊ Generando permisos.' );
      await Permisos.createEach( sails.config.colecciones.permisos );
    }
    let domain = '@' + sails.config.custom.accountsDomain;

    if ( process.env.CREATE_USERS ) {

      if ( await Usuarios.count( {
        emailAddress: 'super' + domain
      } ) === 0 ) {
        sails.log.verbose( '◊ Generando usuario super' + domain + '...' );
        await Usuarios.create( {
          permisos: [],
          emailAddress: 'super' + domain,
          authorized: true, // autorizado para iniciar sesión.
          fullName: 'Super Administrador de Sistema',
          isSuperAdmin: true,
          perfilName: 'super',
          activo: true,
          // clearPassword:sails.config.custom.firstPassword,
          password: await sails.helpers.passwords.hashPassword( sails.config.custom.firstPassword )
        } );
        sails.log.verbose( '◊ Password: ' + sails.config.custom.firstPassword );
      }
    }

    if ( process.env.CREATE_DEMO_DATA ) {
      if ( await Usuarios.count( {
        emailAddress: 'admin' + domain
      } ) === 0 ) {
        sails.log.verbose( '◊ Generando empresa demo' + domain + '...' );

        // usuario admin
        const usuario = await Usuarios.create( {
          emailAddress: 'admin' + domain,
          fullName: 'Administrador de Demo',
          isSuperAdmin: false,
          perfilName: 'admin',
          activo: true,
          clearPassword: sails.config.custom.firstPassword,
          password: await sails.helpers.passwords.hashPassword( sails.config.custom.firstPassword )
        } ).fetch();
        sails.log.verbose( '->Creado usuario admin:', usuario.emailAddress, '/', usuario.clearPassword );

        // usuario residente
        const residente = await Usuarios.create( {
          emailAddress: 'residente' + domain,
          fullName: 'Usuario Residente de Demo',
          isSuperAdmin: false,
          perfilName: 'residente',
          activo: true,
          movilAccess: true,
          clearPassword: sails.config.custom.firstPassword,
          password: await sails.helpers.passwords.hashPassword( sails.config.custom.firstPassword )
        } ).fetch();
        sails.log.verbose( '->Creado usuario residente:', residente.emailAddress, '/', residente.clearPassword );

        // usuario almacenista
        const almacenista = await Usuarios.create( {
          emailAddress: 'almacenista' + domain,
          fullName: 'Usuario Almacenista de Demo',
          isSuperAdmin: false,
          perfilName: 'almacenista',
          activo: true,
          movilAccess: true,
          clearPassword: sails.config.custom.firstPassword,
          password: await sails.helpers.passwords.hashPassword( sails.config.custom.firstPassword )
        } ).fetch();
        sails.log.verbose( '->Creado usuario almacenista:', almacenista.emailAddress, '/', almacenista.clearPassword );

      }

    }
    sails.log.verbose( `★ Verificación finalizada...` );
    return exits.success();
  }
};
