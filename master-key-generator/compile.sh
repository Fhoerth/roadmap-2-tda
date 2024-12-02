#!/bin/bash

# Crear directorio de salida
mkdir -p dist

# Compilar el archivo Java
javac GenerateMasterKey.java

# Crear archivo JAR con el manifiesto
cat <<EOF > MANIFEST.MF
Main-Class: GenerateMasterKey
EOF
jar cfm generate-master-key.jar MANIFEST.MF GenerateMasterKey.class

# Crear el ejecutable con encabezado para Java
echo "#!/usr/bin/java -jar" > generate-master-key
cat generate-master-key.jar >> generate-master-key

# Hacerlo ejecutable
chmod +x generate-master-key

# Mover archivos al directorio dist
mv GenerateMasterKey.class dist
mv generate-master-key.jar dist
mv generate-master-key dist

# Mover ejecutable a nivel superior
mv dist/generate-master-key ../

# Limpiar archivos temporales
rm MANIFEST.MF

echo "El ejecutable se encuentra en ../generate-master-key"
