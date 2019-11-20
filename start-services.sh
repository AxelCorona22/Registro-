#!/bin/bash

#inicia los servicios requeridos(mssql, redis, nginx) con docker.

#funcion para obtener valores de .env
read_var() {
  if [ -z "$1" ]; then
    echo "environment variable name is required"
    return
  fi

  local ENV_FILE='.env'
  if [ ! -z "$2" ]; then
    ENV_FILE="$2"
  fi

  local VAR
  VAR=$(grep $1 "$ENV_FILE" | xargs)
  IFS="=" read -ra VAR <<< "$VAR"
  echo ${VAR[1]}
}

#obtener valores de .env
MSSQL_PASSWORD=$(read_var MSSQL_PASSWORD .env)
REDIS_AUTH=$(read_var REDIS_AUTH .env)
MSSQL_DB=$(read_var MSSQL_DB .env)
MSSQL_USER=$(read_var MSSQL_USER .env)
MSSQL_PORT=$(read_var MSSQL_PORT .env)

#iniciar servicios
echo "Iniciando instancia de REDIS..."
#docker run -p 6379:6379 -v $PWD/redis:/data -d --name redis --rm redis:4-alpine --appendonly yes --requirepass $REDIS_AUTH
REDIS_HOST=`docker inspect -f "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" redis`
echo "REDIS_HOST=$REDIS_HOST"

echo "Iniciando instancia de MSSQL..."
#docker run -e 'ACCEPT_EULA=Y' -e SA_PASSWORD=$MSSQL_PASSWORD -e 'MSSQL_PID=Express' -p $MSSQL_PORT:$MSSQL_PORT -v $PWD/mssql:/var/opt/mssql -d --name mssql --rm  mcr.microsoft.com/mssql/server:2017-latest-ubuntu
echo "MSSQL_USER: ${MSSQL_USER}"
echo "MSSQL_PASSWORD: ${MSSQL_PASSWORD}"
MSSQL_HOST=`docker inspect -f "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" mssql`
echo "MSSQL_HOST=$MSSQL_HOST"

#esperar a que mssql arranque...
until nc -z localhost $MSSQL_PORT
do
  echo "Esperando a que mssql (localhost:$MSSQL_PORT) arranque..."
  sleep 1
done

#crear la base de datos en caso queno exista
echo "Verificando existencia de BD..."
docker exec mssql /opt/mssql-tools/bin/sqlcmd -d master -U $MSSQL_USER -P $MSSQL_PASSWORD -q  "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '$MSSQL_DB') CREATE DATABASE $MSSQL_DB;SELECT name FROM sys.databases WHERE name = '$MSSQL_DB';"
