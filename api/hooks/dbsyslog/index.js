var forwarded = require( 'forwarded-for' );
module.exports = function defineCustomHook ( sails ) {

  return {

    /**
     * Se ejecuta al iniciar la aplicacion
     *
     * @param {Function} done
     */
    initialize: async function ( done ) {
      sails.log.info( '·• Inicializando Hook... (`api/hooks/dbsyslog`)' );
      return done();
    },

    routes: {

      /**
       * Runs before every matching route.
       * @param {Ref} req
       * @param {Ref} res
       * @param {Function} next
       */
      before: {
        '/*': {
          skipAssets: true,
          fn: async function ( req, res, next ) {

            var omitir = [
              '/api/v1/account/canales',
              '/api/v1/soporte/get',
              '/api/v1/catalogos/municipios/auto',
              '/api/v1/conceptossiox/get',
            ];
            if ( omitir.indexOf( req.originalUrl ) === -1 ) {
              var address = forwarded( req, req.headers );
              var usuario;
              if ( req.me && req.me.id ) {
                usuario = req.me.id;
              }
              var dataToSend = {
                usuario: usuario,
                method: req.method,
                url: req.url,
                isSocket: req.isSocket || false,
                ip: address.ip,
                userAgent: req.headers['user-agent'],
                headers: req.headers,
                referer: req.headers.referer || '',
                origin: req.headers.origin || '',
                body: _.omit( req.body, [
                  'password',
                  'confirmPassword',
                  'token',
                  '_csrf',
                ] )
              };
              // console.log('Logsistema:->hooks/custom/index.js::::::', dataToSend);
              /* Logsistema.create( dataToSend ).exec( ( err ) => {
                if ( err ) {
                  sails.log( 'hooks:dbsyslog-> No se pudo crear log de sistema:', err );
                }
              } );*/
            }

            return next();
          }
        }
      }
    }
  };

};
