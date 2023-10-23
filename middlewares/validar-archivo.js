const { response } = require("express");

const validarArchivoSubir = (req, res = response, next) => {
    // req.files: archivos que se subieron, si no hay archivos subidos, entonces no se sube nada
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: 'No hay archivos que subir - validarArchivoSubir'
        });
    }
    next();
}

module.exports = {
    validarArchivoSubir
};
