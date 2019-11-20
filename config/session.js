/* eslint-disable camelcase*/
/**
 * Session Configuration
 * (sails.config.session)
 *
 * Use the settings below to configure session integration in your app.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For all available options, see:
 * https://sailsjs.com/config/session
 */
require( 'dotenv' ).config();

let session = {
  /** *************************************************************************
  *                                                                          *
  * Session secret is automatically generated when your new app is created   *
  * Replace at your own risk in production-- you will invalidate the cookies *
  * of your users, forcing them to log in again.                             *
  *                                                                          *
  ***************************************************************************/
  secret: process.env.SESSION_SECRET,


  /** *************************************************************************
  *                                                                          *
  * Customize when built-in session support will be skipped.                 *
  *                                                                          *
  * (Useful for performance tuning; particularly to avoid wasting cycles on  *
  * session management when responding to simple requests for static assets, *
  * like images or stylesheets.)                                             *
  *                                                                          *
  * https://sailsjs.com/config/session                                       *
  *                                                                          *
  ***************************************************************************/
  isSessionDisabled: function ( req ) {
    return !!req.path.match( req._sails.LOOKS_LIKE_ASSET_RX );
  }
};

if ( process.env.REDIS_HOST && process.env.REDIS_PORT && process.env.REDIS_DB ) {
  session.adapter = '@sailshq/connect-redis';
  session.onRedisDisconnect = function () {
    sails.hooks.panico.panic();
  };
  session.onRedisReconnect = function () {
    sails.hooks.panico.chill();
  };
  if ( process.env.REDIS_AUTH ) {
    session.url = `redis://:${process.env.REDIS_AUTH}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`;
  } else {
    session.url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`;
  }
}
module.exports.session = session;
