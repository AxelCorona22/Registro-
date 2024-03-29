module.exports = {
  friendlyName: 'Login',
  description: 'Log in using the provided email and password combination.',
  extendedDescription: `This action attempts to look up the user record in the database with the
specified email address.  Then, if such a user exists, it uses
bcrypt to compare the hashed password from the database with the provided
password attempt.`,
  inputs: {
    emailAddress: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: 'string',
      required: true,
      isEmail: true
    },
    password: {
      description: 'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      type: 'string',
      required: true
    },
    rememberMe: {
      description: 'Whether to extend the lifetime of the user\'s session.',
      extendedDescription: `Note that this is NOT SUPPORTED when using virtual requests (e.g. sending
requests over WebSockets instead of HTTP).`,
      type: 'boolean'
    }
  },
  exits: {
    success: {
      description: 'The requesting user agent has been successfully logged in.',
      extendedDescription: `Under the covers, this stores the id of the logged-in user in the session
as the \`userId\` key.  The next time this user agent sends a request, assuming
it includes a cookie (like a web browser), Sails will automatically make this
user id available as req.session.userId in the corresponding action.  (Also note
that, thanks to the included "custom" hook, when a relevant request is received
from a logged-in user, that user's entire record from the database will be fetched
and exposed as \`req.me\`.)`
    },

    badCombo: {
      description: `The provided email and password combination does not
      match any user in the database.`,
      responseType: 'unauthorized'
      // ^This uses the custom `unauthorized` response located in `api/responses/unauthorized.js`.
      // To customize the generic "unauthorized" response across this entire app, change that file
      // (see api/responses/unauthorized).
      //
      // To customize the response for _only this_ action, replace `responseType` with
      // something else.  For example, you might set `statusCode: 498` and change the
      // implementation below accordingly (see http://sailsjs.com/docs/concepts/controllers).
    },
    unconfirmed: {
      description: `La cuenta no ha sido confirmada, verifique su email.`,
      responseType: 'unauthorized'
    },
    disabled: {
      description: `La cuenta está desactivada`,
      responseType: 'unauthorized'
    },
    mainDisabled: {
      description: `La cuenta de la empresa está desactivada`,
      responseType: 'unauthorized'
    },
    movilOnly: {
      description: `Este acceso no permite su perfil.`,
      responseType: 'unauthorized'
    }
  },


  fn: async function ( inputs, exits ) {
    // Look up by the email address.
    // (note that we lowercase it to ensure the lookup is always case-insensitive,
    // regardless of which database we're using)
    var userRecord = await Usuarios.findOne( {
      emailAddress: inputs.emailAddress.toLowerCase()
    } );

    // If there was no matching user, respond thru the "badCombo" exit.
    if ( !userRecord ) {
      throw 'badCombo';
    }

    // If the password doesn't match, then also exit thru "badCombo".
    await sails.helpers.passwords.checkPassword( inputs.password, userRecord.password ).
    intercept( 'incorrect', 'badCombo' );

    // si la cuenta no ha sido autorizada
    if ( userRecord.emailStatus === 'unverified' ) {
      return exits.unconfirmed();
    }

    // si la cuenta está desactivada
    if ( !userRecord.activo ) {
      return exits.disabled();
    }

    // si la cuenta de la empresa está desactivada

    if ( userRecord.movilOnly ) {
      throw 'movilOnly';
    }

    // If "Remember Me" was enabled, then keep the session alive for
    // a longer amount of time.  (This causes an updated "Set Cookie"
    // response header to be sent as the result of this request -- thus
    // we must be dealing with a traditional HTTP request in order for
    // this to work.)
    if ( inputs.rememberMe ) {
      if ( this.req.isSocket ) {
        sails.log.warn( 'Received `rememberMe: true` from a virtual request, but it was ignored\n' +
          'because a browser\'s session cookie cannot be reset over sockets.\n' +
          'Please use a traditional HTTP request instead.' );
      } else {
        this.req.session.cookie.maxAge = sails.config.custom.rememberMeCookieMaxAge;
      }
    } // ﬁ

    // si el usuario tiene activada mfa, redireccionar a validar su codigo
    if ( userRecord.mfa && userRecord.mfa.enrolled ) {
      this.req.session.mfaOk = false;
      this.req.session.userId = userRecord.id;
      return exits.success();
    }

    this.req.session.mfaOk = true;
    this.req.session.mfaPassed = false;

    // Modify the active session instance.
    this.req.session.userId = userRecord.id;

    // mandar un socket...
    sails.sockets.broadcast( 'app', 'login', userRecord.fullName );

    // var token = jwtService.issue({id: userRecord.id });
    // Send success response (this is where the session actually gets persisted)
    slackService.post( 'entrance/login->user:' + userRecord.emailAddress );


    // If our "lastSeenAt" attribute for this user is at least a few seconds old, then set it
    // to the current timestamp.
    //
    // (Note: As an optimization, this is run behind the scenes to avoid adding needless latency.)
    var updated;
    try {
      updated = await Usuarios.update( {
        id: this.req.session.userId
      }, {
        lastSeenAt: ( new Date() ).toISOString()
      } ).fetch();
    } catch ( err ) {
      if ( err ) {
        sails.log.error( 'Background task failed: Could not update user (`' + this.req.session.userId + '`) with a new `lastSeenAt` timestamp.  Error details: ' + err.stack );
      } // •
    }
    sails.log.silly( 'Updated the `lastSeenAt` timestamp for user `' + this.req.session.userId + '`.', updated );

    return exits.success();

  }

};
