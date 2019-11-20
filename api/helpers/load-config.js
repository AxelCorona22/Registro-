module.exports = {
  friendlyName: 'Load config',
  description: 'Carga la configuración personal',
  inputs: {
    // none
  },
  exits: {
    success: {
      description: 'La configuración fué cargada ya sea de redis o json.'
    }
  },
  fn: async function ( inputs, exits ) {
    var path = require( 'path' );

    // ir por la configuracion a redis...
    var configuracionInfo = await redisConfigService.get();

    // si la configuracionya existe.
    if ( configuracionInfo && typeof configuracionInfo.flashType !== 'undefined' ) {
      // configuración ya existe...
      sails.log.verbose( '★ Configuración cargada (REDIS)...' );
      sails.config.opciones = configuracionInfo;
    } else { // no existe, existe json?

      var configuracionPath = path.resolve( sails.config.appPath, 'configuracion.json' );
      var configuracionInfoJson = await sails.helpers.fs.readJson( configuracionPath ).tolerate( 'doesNotExist' );

      if ( configuracionInfoJson && configuracionInfoJson.flashType !== 'undefined' ) {
        sails.log.verbose( '★ Configuración cargada (JSON)...' );
        sails.config.opciones = configuracionInfoJson;
        // pasar a redis!
        var hecho = await redisConfigService.set( configuracionInfoJson );

        var toRedis = '->REDIS';
        if ( hecho !== 'OK' ) {
          sails.log.verbose( '⚇ No se pudo establecer la configuración JSON->REDIS! Instancia no stateless.' );
          toRedis = '';
        }

        sails.log.verbose( `★ Configuración inicializada (JSON${toRedis})...` );
      } else { // no está el json... inicializarlo

        var opciones = {
          flashType: 'alertify', // [alertify|alert]
          emailFromName: `Sistema de Correo ${sails.config.custom.app.name} ${sails.config.custom.app.version}`,
          invitarMultiFactor: false,
          gmailUser: process.env.GMAIL_USER || 'user@gmail.com',
          gmailPassword: process.env.GMAIL_PASSWORD || '',
          internalEmailAddress: '',
          verifyEmailAddresses: false
        };

        // inicializar JSON
        await sails.helpers.fs.writeJson.with( {
          destination: configuracionPath,
          json: opciones,
          force: true
        } ).tolerate( ( err ) => {
          var msg = '☠ No se pudo generar el archivo .json de configuración. appPath: `' + sails.config.appPath + '`.  Error: ' + err.stack + '\n\n';
          sentryService.captureMessage( msg );
          return exits.error( msg );
        } );

        hecho = await redisConfigService.set( opciones );

        toRedis = ', REDIS';
        if ( hecho !== 'OK' ) {
          toRedis = '';
          sails.log.verbose( '⚇ No se pudo establecer la configuración inicial REDIS!. Instancia no Stateless.' );
        }
        // cargar!
        sails.config.opciones = opciones;

        sails.log.verbose( `★ Configuración inicializada (JSON${toRedis})...` );
      }
    }
    return exits.success();
  }
};
