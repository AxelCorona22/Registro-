require( 'dotenv' ).config();
const { WebClient } = require( '@slack/web-api' );
var webC;
if ( process.env.SLACK_TOKEN || process.env.SLACK_CHANNEL ) {
  webC = new WebClient( process.env.SLACK_TOKEN );
  ( async () => {
    try {
      await webC.chat.postMessage( {
        text: ( process.env.SLACK_BOT_NAME || 'slackBot' ) + ' ha sido inicializado!',
        channel: process.env.SLACK_CHANNEL
      } );
    // This method call should fail because we're giving it a bogus user ID to lookup.
    } catch ( error ) {
    // Check the code property, and when its a PlatformError, log the whole response.
      console.log( error );
      // Some other error, oh no!
      console.log( 'Well, that was unexpected.' );
    }
  } )();
}

module.exports.post = async function ( message ) {
  if ( !webC ) { return false; }
  try {
    return await webC.chat.postMessage( {
      text: ( new Date ).toISOString() + ' :: ' + message,
      channel: '#' + process.env.SLACK_CHANNEL
    } );
  } catch ( e ) {
    sails.log( 'error al mandar slack post', e );
    return e;
  }
};

module.exports.soporte = async function ( solicitud ) {
  if ( !webC ) { return false; }
  try {
    return await webC.chat.postMessage( {
      text: solicitud.tipo,
      'icon_emoji': ':robot_face:',
      'as_user': false,
      username: 'SoporteBot',
      blocks: [
        {
          'type': 'divider'
        },
        {
          'type': 'section',
          'text': {
            'type': 'mrkdwn',
            'text': ( new Date ).toISOString() + ' :: *' + solicitud.tipo + '*'
          }
        },
        {
          'type': 'divider'
        },
        {
          'type': 'section',
          'text': {
            'type': 'mrkdwn',
            'text': ':raising_hand: *' + solicitud.user.fullName + '*'
          }
        },
        {
          'type': 'section',
          'text': {
            'type': 'mrkdwn',
            'text': solicitud.descripcion
          }
        },
        {
          'type': 'divider'
        },
      ],
      channel: '#' + process.env.SLACK_CHANNEL
    } );
  } catch ( e ) {
    sails.log( 'error al mandar slack post', e );
    return e;
  }
};
