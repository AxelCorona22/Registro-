module.exports = function jsonResponse ( data ) {
  let res = this.res;
  sails.log.verbose( 'Ran custom response: res.jsonResponse()' );
  return res.send( data );
};
