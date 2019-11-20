require( 'dotenv' ).config();
module.exports.onesignal = {
  appId: process.env.ONE_SIGNAL_APP_ID,
  apiKey: process.env.ONE_SIGNAL_API_KEY
};
