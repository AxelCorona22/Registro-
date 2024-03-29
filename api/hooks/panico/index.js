module.exports = function defineCustomHook ( sails ) {
  var panicLevel = 0;

  return {

    defaults: {
      __configKey__: {
        textMessage: 'Sitio en Mantenimiento.',
        status: 503
      }
    },

    configure: function () {
      // If no view is configured, try to default to views/panico.ejs if it exists
      if ( 'undefined' === typeof sails.config[this.configKey].view ) {
        try {
          // si existe la vista panico.ejs usar esa
          if ( require( 'fs' ).existsSync( require( 'path' ).resolve( sails.config.appPath, 'views', 'panico.ejs' ) ) ) {
            sails.config[this.configKey].view = 'panico';
          }
        } catch ( e ) { console.log( 'No se pudo configurar la vista a usar', e ); }
      }
    },

    initialize: function ( cb ) {
      sails.log.info( '·• Inicializando Hook... (`api/hooks/panico`)' );
      return cb();
    },
    routes: {
      before: {
        '/*': {
          skipAssets: true,
          fn: async function ( req, res, next ) {
            // If the panic level is <= zero, no need for panic mode.
            if ( panicLevel <= 0 ) {
              return next();
            }
            var accept = req.get( 'Accept' ) || '';

            // Flag indicating whether HTML was explicitly mentioned in the Accepts header
            req.explicitlyAcceptsHTML = ( accept.indexOf( 'html' ) !== -1 );

            // Flag indicating whether a request would like to receive a JSON response
            //
            // This qualification is determined based on a handful of heuristics, including:
            // • if this looks like an AJAX request
            // • if this is a virtual request from a socket
            // • if this request DOESN'T explicitly want HTML
            // • if this request has a "json" content-type AND ALSO has its "Accept" header set
            // • if this request has the option "wantsJSON" set
            req.wantsJSON = req.xhr;
            req.wantsJSON = req.wantsJSON || req.isSocket;
            req.wantsJSON = req.wantsJSON || !req.explicitlyAcceptsHTML;
            req.wantsJSON = req.wantsJSON || ( req.is( 'json' ) && req.get( 'Accept' ) );

            // Set the response status
            res.status( sails.config.panico.status || 200 );

            // If the "view" config was explicitly set to false, just show a JSON or text message.
            if ( sails.config.panico.view === false || req.wantsJSON ) {
              if ( sails.config.panico.json_message ) {
                return res.json( sails.config.panico.json_message );
              }
              return res.send( sails.config.panico.textMessage );
            }
            // If "view" config was set, then serve that view
            else if ( sails.config.panico.view ) {
              return res.view( sails.config.panico.view, sails.config.panico.viewLocals || {} );
            }
            // Otherwise if "view" config was left completely blank, serve our default maintenance page
            else {
              return res.view( require( 'path' ).resolve( __dirname, 'panic.ejs' ), { layout: false } );
            }
          }
        }
      }
    },

    panic: function () {
      panicLevel++;
    },

    chill: function () {
      panicLevel--;
      if ( panicLevel < 0 ) {
        sails.log.warn( 'Panic level dropped to less than zero; resetting to zero.' );
        panicLevel = 0;
      }
      return;
    },

    reset: function () {
      panicLevel = 0;
    }

  };

};
