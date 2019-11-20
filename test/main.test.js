supertest = require( 'supertest-session' );
testEmail = 'testerx123@snell.com.mx';
/**
 * Este archivo define el orden en el cual se ejecutarán las pruebas
 *
 */
require( './models/user.spec' ); // crea y verifica que exista el usuario testing@snell.com.mx
require( './controllers/entrance/login.spec' ); // hace login con el usuario de pruebas creado
require( './controllers/dashboard/view-dashboard.spec' ); // hace login con el usuario de pruebas creado
require( './controllers/entrance/accept-tos.spec' ); // hace login con el usuario de pruebas creado
require( './controllers/security/csrf.spec' ); // hace login con el usuario de pruebas creado
require( './helpers/qrcode.spec' ); // verifica salida svg y png del generador de QRs
require( './models/delete-test-user.spec' ); // borrar el usaurio de pruebas
