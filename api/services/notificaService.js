/* eslint-disable camelcase*/
/*
████████ ███████ ███    ███ ██████  ██       █████  ████████ ███████ ███████ ███    ███  █████  ██ ██
   ██    ██      ████  ████ ██   ██ ██      ██   ██    ██    ██      ██      ████  ████ ██   ██ ██ ██
   ██    █████   ██ ████ ██ ██████  ██      ███████    ██    █████   █████   ██ ████ ██ ███████ ██ ██
   ██    ██      ██  ██  ██ ██      ██      ██   ██    ██    ██      ██      ██  ██  ██ ██   ██ ██ ██
   ██    ███████ ██      ██ ██      ███████ ██   ██    ██    ███████ ███████ ██      ██ ██   ██ ██ ███████
*/

module.exports.templateEmail = async function ( obj ) {

  if ( !sails.config.opciones.gmailUser || !sails.config.opciones.gmailPassword ) {
    sails.log.warn( '⚠ notificaService.templateEmail():No se pudo enviar email: configuración gmail incompleta.' );
    return;
  }

  var nodemailer = require( 'nodemailer' );

  var cuentasMailer = nodemailer.createTransport( {
    service: 'gmail',
    auth: {
      user: sails.config.opciones.gmailUser,
      pass: sails.config.opciones.gmailPassword
    }
  } );

  // renderizar la plantilla...
  obj.templateData.layout = '/layouts/layout-email';
  obj.templateData.url = require( 'url' );

  var mailObj = {
    from: '"' + ( sails.config.opciones.emailFromName || '' ) + '" <' + sails.config.opciones.internalEmailAddress + '>',
    to: obj.to,
    subject: obj.subject,
    html: await sails.renderView( 'emails/' + obj.template, obj.templateData )
  };

  try {
    const resultado = await cuentasMailer.sendMail( mailObj );
    sails.log.silly( 'notificaService.templateEmail():Email enviado:', resultado );
    return resultado;
  } catch ( error ) {
    sails.log.warn( 'notificaService.templateEmail():No se pudo enviar email:', error );
    // throw (error);
    return false;
  }
};

/*
 ██████  ███    ██ ███████ ███████ ██  ██████  ███    ██  █████  ██
██    ██ ████   ██ ██      ██      ██ ██       ████   ██ ██   ██ ██
██    ██ ██ ██  ██ █████   ███████ ██ ██   ███ ██ ██  ██ ███████ ██
██    ██ ██  ██ ██ ██           ██ ██ ██    ██ ██  ██ ██ ██   ██ ██
 ██████  ██   ████ ███████ ███████ ██  ██████  ██   ████ ██   ██ ███████
*/

module.exports.oneSignal = async function ( ids, titulo, mensaje, data, tipo ) {

  sails.log( 'notificaService->oneSignal', ids, titulo, mensaje, data, tipo );

  if ( !sails.config.onesignal || !sails.config.onesignal.apiKey || !sails.config.onesignal.appId ) {
    return sails.log( 'OneSignal no ha sido configurado, notificación ignorada.', sails.config.onesignal );
  }

  var optionsOnesignal = {
    host: 'onesignal.com',
    port: 443,
    path: '/api/v1/notifications',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Basic ' + sails.config.onesignal.apiKey
    }
  };

  var https = require( 'https' );

  if ( typeof ids === 'string' ) { ids = [ ids, ]; }

  var req = https.request( optionsOnesignal, ( res ) => {
    res.on( 'data', ( data ) => {
      sails.log( 'notificaService.oneSignal():Response:' );
      sails.log( JSON.parse( data ) );
      return;
    } );
  } );

  req.on( 'error', ( e ) => {
    sails.log.error( 'notificaService.oneSignal():Error:', e );
  } );

  var message = {
    app_id: sails.config.onesignal.appId,
    headings: {
      'en': titulo,
      'es': titulo
    },
    subtitle: {
      'en': mensaje,
      'es': mensaje
    },
    contents: {
      'en': mensaje,
      'es': mensaje
    },
    include_player_ids: ids
  };

  if ( data ) {
    data.tipo = tipo || 'manual';
  } else {
    data = {
      tipo: 'manual'
    };
  }

  message.data = data;

  sails.log.verbose( 'notificaService.oneSignal():Notificando', message, '->', ids );

  req.write( JSON.stringify( message ) );

  req.end();
};


module.exports.sms = async function ( celular, mensaje ) {
  sails.log.info( 'No hay funcionalidad SMS aún.', celular, mensaje );
  return true;
};
