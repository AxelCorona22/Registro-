var moment = require( 'moment' );

module.exports = {

  friendlyName: 'Get',

  description: 'Get tramites.',

  inputs: {
    sort: {
      type: 'json'
    },
    pageSize: {
      type: 'number',
      defaultsTo: 20
    },
    pageNumber: {
      type: 'number',
      defaultsTo: 1
    },
    filters: {
      type: 'json'
    }
  },


  exits: {

  },


  fn: async function ( inputs, exits ) {
    var skip = ( inputs.pageSize * inputs.pageNumber ) - inputs.pageSize;
    var matchGeneral = {
      $match: {}
    };
    /*
    ███████ ██ ██   ████████ ███████ ██████  ███████
    ██      ██ ██      ██    ██      ██   ██ ██
    █████   ██ ██      ██    █████   ██████  ███████
    ██      ██ ██      ██    ██      ██   ██      ██
    ██      ██ ███████ ██    ███████ ██   ██ ███████
    */
    var filters = [];
    var search = '';
    if ( inputs.filters && inputs.filters.length ) {
      // 0: {field: "userName", filters: Array(1)}
      // 1: {field: "url", filters: Array(1)}
      // 2: {field: "userAgent", filters: Array(1)}
      // 3: {field: "createdAt", filters: Array(2)}
      // 4: {field: "ip", filters: Array(1)}
      inputs.filters.map( ( filter, index ) => {
        // =>filter {field:'nameColum', filters:[1]}
        // =>filters:[0] -> {term: "sasa"}
        if ( filter.filters && filter.filters.length === 1 ) {
          if ( filter.filters[0].term && typeof filter.filters[0].term === 'string' ) {
            if ( search && index <= 5 ) {
              search += ' AND ';
            }
            search += `${filter.field}  LIKE '%${filter.filters[0].term}%' `;
          } else if ( typeof filter.filters[0].term === 'boolean' || typeof filter.filters[0].term === 'number' ) {
            if ( typeof filter.filters[0].term !== 'undefined' ) { search[filter.field] = filter.filters[0].term; }
          }
          // =>filter {field:'nameColum', filters:[2]}
          // =>filters:[0] -> {condition: "gt", placeholder: "Después de", term: Thu Oct 10 2019 00:00:00 GMT-0500 (Central Daylight Time)}
          // =>filters:[1] -> {condition: "gt", placeholder: "Antes de de", term: Tue Oct 15 2019 00:00:00 GMT-0500 (Central Daylight Time)}
        } else if ( filter.filters.length === 2 && filter.filters[0].term ) {
          if ( search && index < 5 ) {
            search += ' AND ';
          }
          var inicio = moment( filter.filters[0].term ).format( 'YYYY-MM-DD 00:00:00' );
          var fin = moment( filter.filters[1].term ).format( 'YYYY-MM-DD 23:59:59' );
          search += ` createdAt BETWEEN CONVERT(datetime, '${inicio}') AND CONVERT(datetime, '${fin}')`;
        }
        if ( _.keys( search ).length ) {
          filters.push( search );
          // sails.log('search', search);
        }
      } );
    }
    if ( filters.length ) { matchGeneral.$match.$and = filters; }
    /*
    ███████  ██████  ██████  ████████
    ██      ██    ██ ██   ██    ██
    ███████ ██    ██ ██████     ██
         ██ ██    ██ ██   ██    ██
    ███████  ██████  ██   ██    ██
    */

    var sort = '';
    var ordenes = inputs.sort && inputs.sort.length ? _.sortBy( inputs.sort, 'priority' ) : [];
    if ( ordenes && ordenes.length ) {
      inputs.sort.map( ( o, index ) => {
        if ( sort && index < inputs.sort.length ) {
          sort += ', ';
        }
        sort += `${o.field} ${o.order}`;
      } );
    } else {
      sort = 'createdAt DESC';
    }
    var response;
    var responseCuantos;
    if ( search ) {
      search = 'WHERE ' + search;
    }
    var query = `SELECT id,method, url, body, isSocket, ip, userAgent, origin, headers, 
    (SELECT fullName, perfil FROM usuarios WHERE usuarios.id = logsistema.usuario FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER) AS usuario
     FROM logsistema
     ${search}
     ORDER BY ${sort}
     OFFSET ${skip} ROWS
     FETCH NEXT ${inputs.pageSize} ROWS ONLY`;
    try {
      responseCuantos = await Usuarios.getDatastore().sendNativeQuery( `SELECT COUNT (id) as total FROM [dbo].[logsistema] ${search}` );
      response = await Usuarios.getDatastore().sendNativeQuery( query );
      response.recordset.forEach( ( r ) => {
        r.body = JSON.parse( r.body );
        r.usuario = JSON.parse( r.usuario );
      } );
      var respuesta = {
        totalItems: responseCuantos.recordset[0].total || 0,
        data: response.recordset,
        skip: skip
      };
      return exits.success( respuesta );
    } catch ( e ) {
      return exits.error( e );
    }
  }


};
