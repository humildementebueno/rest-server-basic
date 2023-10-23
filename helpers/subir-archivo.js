const path = require('path');
const { v4: uuidv4 } = require('uuid');


const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {

    return new Promise((resolve, reject) => {

        // archivo: archivo que se subió
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');//separa elemento entre "." en un arreglo
        const extension = nombreCortado[nombreCortado.length - 1];

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida  ${extensionesValidas}`);
        }


        const nombreTemp = uuidv4() + '.' + extension;
        //extrae el archivo dentro de ../uploads/ 
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        // mueve el path a donde quiere colocaar
        archivo.mv(uploadPath, (err) => {
            if (err){
                reject(err);
            }
                
            resolve( nombreTemp );
        });

    });





}

module.exports = {
    subirArchivo
}