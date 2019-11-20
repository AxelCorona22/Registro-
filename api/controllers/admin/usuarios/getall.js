var moment = require( 'moment' );
module.exports = {

  friendlyName: 'Paginación',
  description: 'Paginación de cualquier modelo.',
  inputs: {
    cuantos: {
      type: 'number',
      required: true,
      description: 'Número de registros que necesitas'
    },
    pag: {
      type: 'number',
      required: true,
      description: 'Número de página que se necesita'
    },
    search: {
      type: 'string',
      required: false,
      description: 'Valor a filtrar en el grid actual'
    },
    datosFecha: {
      type: 'json',
      required: false,
      description: 'El objeto contiene datos, para consulta por dia, semana, mes y peridodo en especifico '
    }
  },
  exits: {

  },

  fn: async function ( inputs, exits ) {
    var skip = ( inputs.cuantos * inputs.pag ) - inputs.cuantos;
    var matchGeneral = 'activo = 1';

    if ( this.req.me.empresa && this.req.me.empresa.id ) {
      matchGeneral += ' AND empresa = ' + this.req.me.empresa.id;
    }

    var matchFechas = '';
    var inicio;
    var fin;
    if ( inputs.datosFecha && inputs.datosFecha.mostrar && inputs.datosFecha.select ) {
      switch ( inputs.datosFecha.select ) {
        case 'dia':
          inicio = moment().format( 'YYYY-MM-DD 00:00:00' );
          fin = moment().format( 'YYYY-MM-DD 23:59:59' );
          break;
        case 'semana':
          inicio = moment().startOf( 'week' ).
format( 'YYYY-MM-DD 00:00:00' );
          fin = moment().endOf( 'week' ).
format( 'YYYY-MM-DD 00:00:00' );
          break;
        case 'mes':
          inicio = moment().startOf( 'month' ).
format( 'YYYY-MM-DD 00:00:00' );
          fin = moment().endOf( 'month' ).
format( 'YYYY-MM-DD 00:00:00' );
          break;
        case 'periodo':
          inicio = moment( inputs.datosFecha.fechaInicio ).format( 'YYYY-MM-DD 00:00:00' );
          fin = moment( inputs.datosFecha.fechaFin ).format( 'YYYY-MM-DD 23:59:59' );
          break;
        default:
      }
      matchFechas = ` AND createdAt BETWEEN CONVERT(datetime, '${inicio}') AND CONVERT(datetime, '${fin}')`;
    }

    /*
    ██████  ██    ██ ███████  ██████  ██    ██ ███████ ██████   █████
    ██   ██ ██    ██ ██      ██    ██ ██    ██ ██      ██   ██ ██   ██
    ██████  ██    ██ ███████ ██    ██ ██    ██ █████   ██   ██ ███████
    ██   ██ ██    ██      ██ ██ ▄▄ ██ ██    ██ ██      ██   ██ ██   ██
    ██████   ██████  ███████  ██████   ██████  ███████ ██████  ██   ██
                                 ▀▀
    */
    var matchBusqueda = '';
    if ( inputs.search ) {
      matchBusqueda = ` AND fullName LIKE '%${inputs.search}%'`;
    }
    var responseCuantos;
    var order = ' createdAt DESC'; // 'campo1 ASC, campo2 DESC, field order'

    var query = `
    SELECT
      usuarios.id,
      perfilName,
      emailAddress,
      fullName,
      celular,
      usuarios.permisos,
      ( SELECT * FROM [dbo].[perfiles]
        WHERE usuarios.perfilName=perfiles.nombre
        FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER ) AS perfil
    FROM [dbo].[usuarios]
    WHERE ${matchGeneral} ${matchFechas} ${matchBusqueda}
    ORDER BY ${order}
    OFFSET ${skip} ROWS
    FETCH NEXT ${inputs.cuantos} ROWS ONLY;`;

    var response = {};
    try {
      responseCuantos = await Usuarios.getDatastore().sendNativeQuery( `SELECT COUNT (id) as total FROM [dbo].[usuarios] WHERE ${matchGeneral} ${matchFechas} ${matchBusqueda}` );
      response = await Usuarios.getDatastore().sendNativeQuery( query );
    } catch ( e ) {
      console.log( 'error', e );
      return exits.error( e );
    }
    if ( !response.recordset ) {
      return exits.success( {
        total: 0,
        registros: [],
        skip: 0
      } );
    }
    response.recordset.forEach( ( r ) => {
      r.permisos = JSON.parse( r.permisos );
      if ( r.perfil ) { r.perfil = JSON.parse( r.perfil ); }
      if ( typeof r.perfil.permisos === 'string' ) { r.perfil.permisos = JSON.parse( r.perfil.permisos ); }
    } );
    var respuesta = {
      total: responseCuantos.recordset[0].total,
      registros: response.recordset,
      skip: skip
    };
    return exits.success( respuesta );
  }

};
