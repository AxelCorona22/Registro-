module.exports = function defineCustomHook ( sails ) {

  return {

    /**
     * Se ejecuta al iniciar la aplicacion
     *
     * @param {Function} done
     */
    initialize: async function ( done ) {
      sails.log.info( '·• Inicializando Hook... (`api/hooks/custom`)' );
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

            // en cada solicitud ir a ver a redis la configuracion en caso que haya cambiado.
            var configuracionInfo = await redisConfigService.get();
            if ( configuracionInfo && typeof configuracionInfo.flashType !== 'undefined' ) {
              sails.log.silly( 'Hook (`api/hooks/custom`) ★ Configuración cargada (REDIS)...' );
              sails.config.opciones = configuracionInfo;
            }

            var url = require( 'url' );

            // Primero, si es un GET (y posiblemente una vista),
            // adjuntar locales que sabemos se usaran en el layout.
            if ( req.method === 'GET' ) {

              // The  `_environment` local lets us do a little workaround to make js
              // run in "production mode" without unnecessarily involving complexities
              // with webpack et al.)
              if ( res.locals._environment !== undefined ) {
                throw new Error( 'Cannot attach Sails environment as the view local `_environment`, because this view local already exists!  (Is it being attached somewhere else?)' );
              }
              res.locals.url = req.url || '/';
              res.locals._environment = sails.config.environment;
              res.locals._hostEnv = sails.config.custom.hostEnv;
              res.locals.supportEnabled = sails.config.custom.supportEnabled;
              res.locals.invitarMultiFactor = sails.config.opciones.invitarMultiFactor ? 'si' : false;
              res.locals.isEmailVerificationRequired = sails.config.opciones.verifyEmailAddresses;
              res.locals.flashType = sails.config.opciones.flashType;
              res.locals.app = sails.config.custom.app;
              res.locals.deploy = sails.config.opciones.deploy;
              // The `me` local is set explicitly to `undefined` here just to avoid having to
              // do `typeof me !== 'undefined'` checks in our views/layouts/partials.
              // > Note that, depending on the request, this may or may not be set to the
              // > logged-in user record further below.
              if ( res.locals.me !== undefined ) {
                throw new Error( 'Cannot attach view local `me`, because this view local already exists!  (Is it being attached somewhere else?)' );
              }
              res.locals.me = undefined;
            } // ﬁ

            // No session? Proceed as usual.
            // (e.g. request for a static asset)
            if ( !req.session ) {
              return next();
            }

            // Not logged in? Proceed as usual.
            if ( !req.session.userId ) {
              return next();
            }

            // Otherwise, look up the logged-in user.
            var loggedInUser = await Usuarios.findOne( {
              id: req.session.userId
            } ).
            populate( 'perfil' );

            // If the logged-in user has gone missing, log a warning,
            // wipe the user id from the requesting user agent's session,
            // and then send the "unauthorized" response.
            if ( !loggedInUser ) {
              sails.log.warn( 'El usuario con sesion (`' + req.session.userId + '`) ha desaparecido....' );
              delete req.session.userId;
              return res.unauthorized();
            }


            loggedInUser.permisos = JSON.parse( loggedInUser.permisos );

            // Expose the user record as an extra property on the request object (`req.me`).
            // > Note that we make sure `req.me` doesn't already exist first.
            if ( req.me !== undefined ) {
              throw new Error( 'Cannot attach logged-in user as `req.me` because this property already exists!  (Is it being attached somewhere else?)' );
            }

            var sanitizedFields = [
              'clearPassword',
              'password',
              'passwordResetToken',
              'passwordResetTokenExpiresAt',
              'stripeCustomerId',
              'emailProofToken',
              'emailProofTokenExpiresAt',
            ];

            req.me = _.omit( loggedInUser, sanitizedFields );
            if ( loggedInUser.clearPassword ) {
              req.me.clearPassword = true;
            }
            sails.log.silly( 'Identidad de solicitud creada en hook custom.' );

            // If this is a GET request, then also expose an extra view local (`<%= me %>`).
            // > Note that we make sure a local named `me` doesn't already exist first.
            // > Also note that we strip off any properties that correspond with protected attributes.
            if ( req.method === 'GET' ) {
              if ( res.locals.me !== undefined ) {
                throw new Error( 'Cannot attach logged-in user as the view local `me`, because this view local already exists!  (Is it being attached somewhere else?)' );
              }

              // Exclude any fields corresponding with attributes that have `protect: true`.
              var sanitizedUser = _.extend( {}, loggedInUser );
              for ( let attrName in Usuarios.attributes ) {
                if ( Usuarios.attributes[attrName].protect ) {
                  delete sanitizedUser[attrName];
                }
              } // ∞

              sanitizedUser.profilePicture = '';
              if ( sanitizedUser.imageUploadFd ) {
                sanitizedUser.profilePicture = url.resolve( sails.config.custom.baseUrl, '/api/v1/account/' + sanitizedUser.id + '/photo' );
              }

              res.locals.me = _.pick( sanitizedUser, [
                'id',
                'fullName',
                'emailAddress',
                'perfil',
                'perfilName',
                'profilePicture',
                'emailStatus',
                'emailChangeCandidate',
                'celular',
                'mfa',
                'tos',
              ] );
              delete res.locals.me.mfa.secret;
              delete res.locals.me.mfa.otp;
              delete res.locals.me.mfa.created;
              // se define a este nivel ya que tenemos a loggedInUser en el scope
              res.locals.tienePermiso = function ( permisos ) {
                if ( req.me.perfilName !== 'super' ) {
                  if ( typeof permisos === 'string' ) {
                    permisos = [ permisos, ];
                  }
                  return _.intersection( loggedInUser.permisos, permisos ).length > 0;
                }
                return true; // es superadmin
              };
            } // ﬁ

            // Prevent the browser from caching logged-in users' pages.
            // (including w/ the Chrome back button)
            // > • https://mixmax.com/blog/chrome-back-button-cache-no-store
            // > • https://madhatted.com/2013/6/16/you-do-not-understand-browser-history
            res.setHeader( 'Cache-Control', 'no-cache, no-store' );
            return next();
          }
        }
      }
    }
  };

};
