module.exports = function ( grunt ) {
  grunt.config.set( 'javascript_obfuscator', {
    options: {
      reservedNames: [
        'ng',
        'data',
        'JST',
        'SAILS_LOCALS',
      ],
      compact: true,
      controlFlowFlattening: false,
      controlFlowFlatteningThreshold: 0.1,
      deadCodeInjection: false,
      deadCodeInjectionThreshold: 0.4,
      disableConsoleOutput: false,
      identifierNamesGenerator: 'hexadecimal',
      log: false,
      renameGlobals: true,
      rotateStringArray: true,
      selfDefending: false,
      stringArray: true,
      stringArrayEncoding: 'base64',
      stringArrayThreshold: 0.7,
      transformObjectKeys: false,
      unicodeEscapeSequence: false
    },
    main: {
      files: {
        '.tmp/public/min/production.min.js': [ '.tmp/public/min/production.min.js', ],
        '.tmp/public/jst.js': [ '.tmp/public/jst.js', ]
      }
    }
  } );

  grunt.loadNpmTasks( 'grunt-javascript-obfuscator' );
};
