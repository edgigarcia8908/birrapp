#!/bin/bash
set -e

echo "=== 🍺 Birrapp Deploy ==="

# Usar el directorio donde está el script (funciona en cualquier ubicación)
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"
echo "📁 Directorio: $REPO_DIR"

echo "1. Descargando cambios de GitHub..."
git pull origin master

echo "2. Instalando dependencias..."
npm install --no-fund --no-audit --ignore-scripts

echo "2.1 Instalando @ceo-core/ar desde ceo-core-modules..."
rm -rf /tmp/ceo-core-modules-build
git clone -b main https://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@github.com/edgigarcia8908/ceo-core-modules.git /tmp/ceo-core-modules-build

cd /tmp/ceo-core-modules-build/packages/ceo-ar
npm install --no-fund --no-audit --ignore-scripts
npm run build
npm pack
cd "$REPO_DIR"

npm install --ignore-scripts /tmp/ceo-core-modules-build/packages/ceo-ar/ceo-core-ar-*.tgz
rm -rf /tmp/ceo-core-modules-build

echo "3. Compilando Next.js..."
npm run build

echo "4. Reiniciando con PM2..."
LOG_DIR="$(dirname "$REPO_DIR")/logs"
mkdir -p "$LOG_DIR"

if pm2 describe birrapp > /dev/null 2>&1
then
    echo "Reiniciando instancia PM2 existente..."
    pm2 restart birrapp
else
    echo "Creando nueva instancia PM2..."
    pm2 start npm \
      --name birrapp \
      --cwd "$REPO_DIR" \
      --output "$LOG_DIR/out.log" \
      --error "$LOG_DIR/error.log" \
      --time \
      -- start
fi

echo "5. Guardando estado PM2..."
pm2 save

echo "=== ✅ Deploy Birrapp completado ==="
