const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
]

const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); //TRUE

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }
    //expresion regular que admite sensibilidad con las palabras para buscar
    const regex = new RegExp(termino, 'i');
    //count en vez de find sirve para contar las respuestas
    const usuario = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],//es uno de ellos
        $and: [{ estado: true }]// pero tiene que tener esto si o si
    });//nombre == termino?

    return res.json({
        results: usuario
    })
}

const buscarCategoria = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); //TRUE

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }
    //expresion regular que admite sensibilidad con las palabras para buscar
    const regex = new RegExp(termino, 'i');
    //count en vez de find sirve para contar las respuestas
    const categoria = await Categoria.find({ nombre: regex, estado: true });//eso es un and

    return res.json({
        results: categoria
    })
}
const buscarProductos = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); //TRUE

    if (esMongoID) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }
    //expresion regular que admite sensibilidad con las palabras para buscar
    const regex = new RegExp(termino, 'i');
    //count en vez de find sirve para contar las respuestas
    const producto = await Producto.find({ nombre: regex, estado: true })
        .populate('categoria', 'nombre');;//nombre == termino?

    return res.json({
        results: producto
    })
}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategoria(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
    }

}

module.exports = {
    buscar
}
