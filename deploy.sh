#!/bin/bash
set -e

echo "=== 🍺 Birrapp Deploy ==="

cd /home/birrapp/repo

echo "1. Descargando cambios de GitHub..."
git pull origin master

echo "2. Instalando dependencias..."
npm install --no-fund --no-audit --ignore-scripts

echo "2.1 Instalando @ceo-core/ar desde ceo-core-modules..."
rm -rf /tmp/ceo-core-modules-build
git clone -b main https://${GITHUB_TOKEN}@github.com/edgigarcia8908/ceo-core-modules.git /tmp/ceo-core-modules-build

cd /tmp/ceo-core-modules-build/packages/ceo-ar
npm install --no-fund --no-audit --ignore-scripts
npm run build
npm pack
cd -

npm install --ignore-scripts /tmp/ceo-core-modules-build/packages/ceo-ar/ceo-core-ar-*.tgz

echo "3. Compilando Next.js..."
npm run build

echo "4. Reiniciando con PM2..."
mkdir -p /home/birrapp/logs

if pm2 describe birrapp > /dev/null 2>&1
then
    echo "Reiniciando instancia PM2 existente..."
    pm2 restart birrapp
else
    echo "Creando nueva instancia PM2..."
    pm2 start npm \
      --name birrapp \
      --cwd /home/birrapp/repo \
      --output /home/birrapp/logs/out.log \
      --error /home/birrapp/logs/error.log \
      --time \
      -- start
fi

echo "5. Guardando estado PM2..."
pm2 save

echo "=== ✅ Deploy Birrapp completado ==="
