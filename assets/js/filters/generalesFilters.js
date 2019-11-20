ng.filter( 'siono', () => {
  return function ( value ) {
    var wordNo = 'No';
    var wordSi = 'Si';
    /* if(asIcon && asIcon==='box') {
      wordNo = '<i class="far fa-square" aria-hidden></i>';
      wordSi = '<i class="far fa-check-square" aria-hidden></i>';
    }else{
      wordNo = '<i class="fas fa-thumbs-down" aria-hidden></i>';
      wordSi = '<i class="fas fa-thumbs-up" aria-hidden></i>';
    }*/
    return value ? wordSi : wordNo;
  };
} );
ng.filter( 'pagado', () => {
  return function ( valor ) {
    if ( valor ) {
      return 'PAGADO';
    } else {
      return 'NO PAGADO';
    }
  };
} );
ng.filter( 'pagadoconetiqueta', () => {
  return function ( valor ) {
    if ( valor ) {
      return '<span class="badge badge-success"><i class="fas fa-check" aria-hidden></i></span> PAGADO';
    } else {
      return '<span class="badge badge-danger"><i class="fas fa-times" aria-hidden></i></span> NO PAGADO';
    }
  };
} );
ng.filter( 'solicitud', () => {
  return function ( valor ) {
    if ( valor ) {
      return 'Solicitud de Registro';
    } else {
      return 'La línea de captura no ha sido pagada';
    }
  };
} );
ng.filter( 'tipoPersona', () => {
  return function ( valor ) {
    var persona = valor;
    if ( valor === 'fisica' ) {
      persona = 'FÍSICA';
    }
    return persona;
  };
} );
ng.filter( 'genero', () => {
  return function ( valor ) {
    var g = valor;
    if ( valor === 'H' ) {
      g = 'MASCULINO';
    }
    if ( valor === 'M' ) {
      g = 'FEMENINO';
    }
    return g;
  };
} );
ng.filter( 'reporteFoto', () => {
  return function ( valor ) {
    var estado = '';
    switch ( valor ) {
      case 0:
        estado = 'Solicitado';
        break;
      case 1:
        estado = 'Finalizado';
      default:
    }
    return estado;
  };
} );
ng.filter( 'totalizar', () => {
  return function ( array, campo ) {
    if ( !campo ) { campo = 'total'; }
    return '$ ' + ( _.sumBy( array, campo ) ).toFixed( 2 );
  };
} );
ng.filter( 'estatustramite', () => {
  return function ( estatus, estatuses ) {
    var idx = _.findIndex( estatuses, { estatus: estatus } );
    if ( idx > -1 ) { return estatuses[idx].nombre; }
    return 'Estado No Reconocido';
  };
} );
ng.filter( 'edad', [
  function () {
    return function ( fecha ) {
      if ( !fecha ) { return 'Sin registro'; }
      return moment( [
        moment( fecha ).format( 'YYYY' ),
        moment( fecha ).format( 'MM' ),
        moment( fecha ).format( 'DD' ),
      ] ).fromNow( true );
    };
  },
] );
ng.filter( 'b64', [
  function () {
    return function ( data ) {
      return btoa( data );
    };
  },
] );
ng.filter( 'mayuscula', () => {
  return function ( campo ) {
    return campo ? campo.toUpperCase() : '';
  };
} );

ng.filter( 'fecha', () => {
  var format = '';
  return function ( value, which ) {
    if ( value ) {
      switch ( which ) {
        case 'clasic':
          format = 'DD[/]MM[/]YYYY';
          break;
        case 'long':
          format = 'DD [de] MMM [del] YYYY[,] hh:mm a';
          break;
        case 'middle':
          format = 'DD[/]MMMM[/]YYYY';
          break;
        case 'rh':
          format = 'DD [de] MMMM [del] YYYY';
          break;
        case 'clasic-time':
          format = format = 'DD/MM/YYYY hh:mm a';
          break;
        case 'hora':
          format = 'hh:mm a';
          break;
        default:
          format = 'DD/MM/YYY';
      }
    } else {
      return;
    }
    return moment( value ).format( format );
  };
} );

ng.filter( 'resaltar', [
  function () {
    return function ( text, term ) {
      if ( !term ) { return text; }
      if ( !text ) { return ''; }
      return text.replace( new RegExp( term, 'gi' ), '<span class="texto-resaltado">$&</span>' );
    };
  },
] );

ng.filter( 'nl2br', () => {
  return function ( texto ) {
    if ( !texto ) { return ''; }
    return texto.replace( new RegExp( '\n', 'g' ), '<br>' );
  };
} );

ng.filter( 'toNow', [
  function () {
    return function ( fecha ) {
      if ( !fecha ) { return 'Sin registro'; }
      return moment( fecha ).fromNow();
    };
  },
] );

ng.filter( 'nombreMes', () => {
  return function ( num ) {
    var meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return meses[num - 1];
  };
} );

ng.filter( 'lastWord', [
  function () {
    return function ( file ) {
      return file.substr( file.lastIndexOf( '_' ) + 1 );
    };
  },
] );
