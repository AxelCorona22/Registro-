/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */
require( 'dotenv' ).config();
var path = require( 'path' );
const fs = require( 'fs' );

let rawdata = fs.readFileSync( 'package.json' );
let package = JSON.parse( rawdata );

module.exports.custom = {
  app: {
    name: package.description,
    version: package.version,
    author: package.author
  },
  movilUserAgent: process.env.MOVIL_USER_AGENT,
  sendUserSMS: process.env.SEND_USER_SMS,
  googleAnalytics: process.env.GOOGLE_ANALYTICS_ID,
  absRoute: path.dirname( __dirname ),
  sendUserEmails: process.env.SEND_USER_EMAILS,
  hostEnv: process.env.HOST_ENV,
  supportEnabled: process.env.SUPPORT_ENABLED,
  userAgentString: process.env.MOVIL_USER_AGENT,
  jwtSecret: process.env.JWT_SECRET,
  firstPassword: process.env.PASSWORD_INICIAL,
  sentryNode: process.env.SENTRY_NODE,
  accountsDomain: process.env.ACCOUNTS_DOMAIN,
  baseUrl: process.env.BASE_URL,

  /** ************************************************************************
  *                                                                         *
  * The TTL (time-to-live) for various sorts of tokens before they expire.  *
  *                                                                         *
  **************************************************************************/
  passwordResetTokenTTL: 24, // hours
  emailProofTokenTTL: 24, // hours

  /** ************************************************************************
  *                                                                         *
  * The extended length that browsers should retain the session cookie      *
  * if "Remember Me" was checked while logging in.                          *
  *                                                                         *
  **************************************************************************/
  rememberMeCookieMaxAge: 30 * 24 * 60 * 60 * 1000 // 30 days

};
