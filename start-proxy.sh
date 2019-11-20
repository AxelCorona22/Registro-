#!/bin/bash
echo " * Verificando estructura de archivo nginx/default.conf..."
result=$(docker run --rm -t -a stdout --name test-nginx -v ${PWD}/nginx/default.conf:/etc/nginx/conf.d/default.conf nginx nginx -t)
successful=$(echo $result | grep successful | wc -l)
if [ $successful = 0 ]; then
  echo FAILED
  echo "$result"
  exit 1
else
  echo " * El archivo de configuración parece estar bien, iniciando proxy..."
  docker run -d --name nginx -v $PWD/nginx/default.conf:/etc/nginx/conf.d/default.conf -v $PWD/www:/www -p 80:80 --rm nginx
  echo "NGINX_HOST=`docker inspect -f "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" nginx`"
fi
