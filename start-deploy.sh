#!/bin/bash

#Vamos a intentar hacer un deploy automatizado usando como nombre de carpeta el nombre del proyecto
#si el proceso ya existe en pm2, lo detenemos, hacemos reset a HEAD, hacemos pull al branch correspondiente
#instalamos dependencias y generamos el front en www

usuario=$USER;

if [ "$CI_COMMIT_REF_NAME" = "master" ] ; then
  usuario="gitlab-runner";
fi

#ruta final del deploy
deployPath=/home/$usuario/
backups_folder=/home/$usuario/backups/
mkdir -p $backups_folder
#instancias a usar con el modo cluster de pm2 (al crear una nueva)
instancias=2

#llevar el conteo de deploys en este archivo
INC_COUNT_FILE="deploy_counter.txt"

#verificación de existencia del proceso en pm2
echo "**************************************************************************"
pm2 show $CI_PROJECT_NAME>/dev/null
exists_status=$?
if [ $exists_status -eq 1 ]; then
  #no existe...
  echo "Non existent project..."
  echo "Working dir: $deployPath"
  echo "Branch: $CI_COMMIT_REF_NAME"
  #creamos la carpeta para la ruta final del deploy
  mkdir -p $deployPath
  #y dentro de ella...
  cd $deployPath || exit
  #hacemos un clone al branch que corresponde sin bajar toda la historia del repo.
  git clone $CI_PROJECT_URL
else
  #si ya existe, lo detenemos...
  echo "Stopping process... ($deployPath$CI_PROJECT_NAME)"
  pm2 stop $CI_PROJECT_NAME #detener el proceso de la app, si es que existe.
fi

#entramos...
cd $deployPath$CI_PROJECT_NAME || exit

#actualizamos el repositorio...
echo "**************************************************************************"
echo "Updating project files... ($deployPath$CI_PROJECT_NAME)"
echo "**************************************************************************"
echo "instalando">estatus.txt
git reset --hard HEAD #reset al repo local
git clean -df #reset a los archivos y folders creados
git checkout $CI_COMMIT_REF_NAME #cambiar al branch que toque
git reset --hard HEAD #reset al repo local
git clean -df #reset a los archivos y folders creados
git pull #actualizar

#instalar dependencias
echo "**************************************************************************"
echo "Installing dependencies... ($deployPath$CI_PROJECT_NAME)"
echo "**************************************************************************"
npm i

#sobreescribir configuracion para levantar sails sin grunt
cp .nogrunt .sailsrc

#generar www para la aplicación (buildProd).
echo "**************************************************************************"
echo "(re) Building assets..."
echo "**************************************************************************"
sails www --prod

#Iniciar o crear proceso...
echo "**************************************************************************"
if [ $exists_status -eq 1 ]; then
  echo "Creating new process: $CI_PROJECT_NAME with $instancias instances..."
  #creando proceso de app con las instancias que se requiere
  pm2 start -n $CI_PROJECT_NAME -i $instancias app.js -- --prod
  #guardar estado...
  pm2 save
else
  echo "Starting process... ($CI_PROJECT_NAME)"
  pm2 start $CI_PROJECT_NAME --update-env #iniciando proceso de app
fi
echo "**************************************************************************"

pm2 show $CI_PROJECT_NAME

echo "iniciando">$deployPath$CI_PROJECT_NAME/estatus.txt

#llevamos el contador de los deployments en un archivo, el cual será mostrado en la interfaz
#cuando estemos en development el cual es obtenido por services/ConfigService.js

#si no existe el archivo crearlo con "0"
if test -f $INC_COUNT_FILE; then
  echo "Deploy count is: `cat $INC_COUNT_FILE`"
else
  echo "0" > $INC_COUNT_FILE
fi

#incrementar el contador contenido en archivo
OLD_INC_COUNTER=$(cat "$INC_COUNT_FILE")
NEW_INC_COUNTER=$((OLD_INC_COUNTER+1))
echo "${NEW_INC_COUNTER}" > $INC_COUNT_FILE
echo "Deploy count is now: `cat $INC_COUNT_FILE`"

exit
