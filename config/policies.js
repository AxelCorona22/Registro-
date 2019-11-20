/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  '*': [
    'is-logged-in',
    'is-mfa-ok',
    'flash',
    'permisos',
  ],

  'entrance/*': true,
  'view-nosotros': true,
  'view-contacto': true,
  'view-privacidad': true,
  'view-terminos': true,
  'view-vision': true,
  'view-homepage-or-redirect': true,
  'deliver-contact-form-message': true,

  'account/canales': true,
  'account/validate-mfa': [ 'is-logged-in', ],

  'movil/*': [
    'is-authorized-api-key',
    'jwt',
  ],
  'movil/entrance/login': [
    'movil-user-agent',
    'is-authorized-api-key',
  ],
  'movil/user/validate-mfa': [
    'movil-user-agent',
    'is-authorized-api-key',
    'jwt',
  ],
  'movil/user/download-photo': [ 'movil-user-agent', ],
  'movil/reportesf/imagen': true,
  'movil/reportesf/pdf': true

  // 'admin/*':['is-logged-in', 'jwt','is-mfa-ok','flash','permisos'],
  // supongamos que todo dentro de /secreto requiere que forzosamente tengas activado el MFA
  // 'secreto/*':['is-logged-in', 'jwt', 'is-mfa-ok','is-mfa-forced','flash','permisos'],
};
