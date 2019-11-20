require( 'dotenv' ).config();

let datastores = {
  default: {
    adapter: 'sails-mssql',
    url: `mssql://${process.env.MSSQL_USER || 'sa'}:${process.env.MSSQL_PASSWORD}@${process.env.MSSQL_HOST || 'localhost'}:${process.env.MSSQL_PORT || 1433}/${process.env.MSSQL_DB}`
  }
};

if ( process.env.REDIS_HOST && process.env.REDIS_PORT ) {
  datastores.redis = {
    adapter: 'sails-redis',
    onRedisDisconnect: function () {
      sails.hooks.panico.panic();
    },
    onRedisReconnect: function () {
      sails.hooks.panico.chill();
    }
  };
  if ( process.env.REDIS_AUTH ) {
    datastores.redis.url = `redis://:${process.env.REDIS_AUTH}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`;
  } else {
    datastores.redis.url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`;
  }
}

module.exports.datastores = datastores;
