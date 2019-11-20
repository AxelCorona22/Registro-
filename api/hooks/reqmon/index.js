var forwarded = require( 'forwarded-for' );
module.exports = function defineCustomHook ( sails ) {
  return {
    initialize: async function ( done ) {
      sails.log.info( '·• Inicializando Hook... (`api/hooks/reqmon`)' );
      sails.log.info( '·•   Todas las solicitudes serán logueadas al canal "reqmon" como eventos "request"' );
      return done();
    },
    routes: {
      before: {
        '/*': {
          skipAssets: true,
          fn: async function ( req, res, next ) {
            var omitir = [ // #TODOS: debe venir de config o env
              '/ruta/a/omitir',
            ];
            if ( omitir.indexOf( req.originalUrl ) === -1 ) {
              sails.sockets.broadcast( 'reqmon', 'request', {
                me: req.me ? req.me : false,
                method: req.method,
                url: req.url,
                isSocket: req.isSocket,
                ip: forwarded( req, req.headers ).ip,
                userAgent: req.headers['user-agent'],
                origin: req.headers.origin,
                body: req.body,
                headers: req.headers
              } );
            }
            return next();
          }
        }
      }
    }
  };
};
