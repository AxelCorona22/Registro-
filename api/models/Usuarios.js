var uuidv4 = require( 'uuidv4' ).default;
const moment = require( 'moment' );
var url = require( 'url' );
module.exports = {
  attributes: {
    uuid: {
      type: 'string',
      allowNull: true
    },
    movilOnly: {
      type: 'boolean',
      defaultsTo: false
    },
    perfil: {
      model: 'perfiles'
    },
    perfilName: {
      type: 'string',
      required: true,
      isIn: [
        'super',
        'admin',
        'compras',
        'direccion',
        'residente',
        'almacenista',
        'administracion',
      ]
    },
    tos: {
      type: 'boolean',
      defaultsTo: false
    },
    online: {
      type: 'boolean',
      defaultsTo: false
    },
    socket: {
      type: 'string',
      allowNull: true
    },
    mfa: {
      type: 'json',
      defaultsTo: {
        enrolled: false,
        created: '',
        secret: '',
        otp: ''
      }
    },
    emailAddress: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 100,
      example: 'carol.reyna@microsoft.com'
    },
    password: {
      type: 'string',
      required: false,
      description: 'Securely hashed representation of the user\'s login password.',
      protect: true,
      defaultsTo: '',
      example: '2$28a8eabna301089103-13948134nad'
    },
    fullName: {
      type: 'string',
      required: true,
      description: 'Full representation of the user\'s name',
      maxLength: 120,
      example: 'Lisa Microwave van der Jenny'
    },
    permisos: {
      type: 'ref',
      defaultsTo: []
    },
    isSuperAdmin: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Este en true te da todo el acceso por la policy permisos'
    },
    lastSeenAt: {
      type: 'string',
      columnType: 'date',
      description: 'Fecha en unix time, actualizado cada minuto que el usuario es "visto"',
      example: '2019-09-30T22:55:18.127Z'
    },
    clearPassword: {
      type: 'string',
      defaultsTo: '',
      description: 'Establecido al crear el usuario y si existe, debe cambiar su contraseña.'
    },
    movilAccess: {
      type: 'boolean',
      defaultsTo: false
    },
    imageUploadFd: {
      type: 'string',
      description: 'Descriptor del archivo, ruta absoluta',
      required: false,
      defaultsTo: ''
    },
    imageUploadMime: {
      type: 'string',
      description: 'The MIME type for the uploaded image.',
      required: false,
      defaultsTo: ''
    },
    passwordResetToken: {
      type: 'string',
      description: 'Cuando se solicita cambiar el password se genera este token.'
    },
    passwordResetTokenExpiresAt: {
      type: 'string',
      columnType: 'date',
      allowNull: true,
      description: 'Expiracion en unixtime cuando vence el token.',
      example: 'ISODATE'
    },
    emailProofToken: {
      type: 'string',
      description: 'Token para verificacion de email.'
    },

    emailProofTokenExpiresAt: {
      type: 'string',
      columnType: 'date',
      allowNull: true,
      description: 'Expiración del token de verificación de email.',
      example: 'ISODATE'
    },

    emailStatus: {
      type: 'string',
      isIn: [
        'unconfirmed',
        'changeRequested',
        'confirmed',
      ],
      defaultsTo: 'confirmed',
      description: 'Estado de la confirmación del correo electronico.',
      extendedDescription: `los usuarios pueden ser creados como no confirmados ("unconfirmed") o como confirmados ("confirmed")
Cuando se activa la verificacion por email los usuarios creados van a tener el estado no confirmado hasta que
le den click al enlace que se les envia por email.
De igual manera los usuarios existentes cuando cambian su email pasan por el mismo proceso para poder
cambiar el email.`
    },
    emailChangeCandidate: {
      type: 'string',
      description: 'El email (no confirmado) al que se quiere cambiar.'
    },
    activo: {
      type: 'boolean',
      defaultsTo: false,
      description: 'El usuario está desactivado y no puede iniciar sesion cuando está en true'
    },
    celular: {
      type: 'string',
      defaultsTo: '',
      description: '10 digitos.'
    },
    celularStatus: {
      type: 'string',
      isIn: [
        'unconfirmed',
        'changeRequested',
        'confirmed',
      ],
      defaultsTo: 'unconfirmed'
    },
    tokenSMS: {
      type: 'string',
      allowNull: true
    },
    expiracionTokenSMS: {
      type: 'string',
      columnType: 'date',
      allowNull: true
    },
    pushId: {
      type: 'string',
      allowNull: true
    },
    device: {
      type: 'json',
      defaultsTo: {}
    }
  },
  customToJSON: function () {
    var sanitizedFields = [
      'imageUploadFd',
      'imageUploadMime',
      'password',
      'passwordResetToken',
      'passwordResetTokenExpiresAt',
      'stripeCustomerId',
      'emailProofToken',
      'emailProofTokenExpiresAt',
    ];
    this.profilePicture = '';
    if ( this.imageUploadFd ) {
      this.profilePicture = url.resolve( sails.config.custom.baseUrl, '/api/v1/account/' + this.id + '/photo' );
    }

    return _.omit( this, sanitizedFields );
  },
  beforeCreate: async function ( req, next ) {
    req.uuid = uuidv4();
    req.emailAddress = req.emailAddress.toLowerCase();
    var found = await Usuarios.findOne( {
      where: {
        emailAddress: req.emailAddress
      }
    } );
    if ( found ) {
      return next( 'Usuario Duplicado' );
    }
    // el usuario se puede crear siempre y cuando exista el perfil
    // se crea con los permisos solicitados o con los que contiene la definicion
    // del perfil
    var perfil = await Perfiles.findOne( {
      nombre: req.perfilName
    } );
    if ( !perfil ) {
      return next( 'Inconsistencia en Perfil (404) ' + req.perfilName );
    }
    let permisos = perfil.permisos;
    if ( req.permisos && req.permisos.length ) {
      permisos = req.permisos;
    }
    req.permisos = permisos;
    req.perfil = perfil.id;

    if ( sails.config.custom.sendUserSMS && req.celular ) {
      sails.log.verbose( 'Enviando sms a nuevo usuario:', req.celular );
      const token = parseInt( Math.random() * 1000000 ).toString().
      padStart( 6, '0' );
      req.tokenSMS = token;
      req.expiracionTokenSMS = moment().add( '3', 'days' ).
      format( 'YYYY-MM-DD HH:mm:ss' );
    }

    return next();
  },
  afterCreate: function ( newUser, next ) {
    if ( sails.config.custom.sendUserEmails ) {
      sails.log.verbose( 'Enviando correo a nuevo usuario:', newUser.emailAddress );
      notificaService.templateEmail( {
        to: newUser.emailAddress,
        subject: 'Bienvenido nuevo usuario',
        template: 'email-welcome-user',
        templateData: {
          fullName: newUser.fullName,
          password: newUser.clearPassword
        }
      } );
    }
    if ( sails.config.custom.sendUserSMS && newUser.celular && newUser.tokenSMS ) {
      notificaService.sms( newUser.celular, sails.config.custom.app.name + '\n\nHola ' + newUser.fullName + '. \n\nTu código de verificación celular es: ' + newUser.tokenSMS );
    }
    return next();
  }
};
