const { response, request } = require('express');
const { Producto, Categoria } = require('../models');


//obtenerProducto - paginado - total - populate
const obtenerProductos = async (req, res) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, producto] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    // const categorias = await Categoria.findOne({});

    res.json({
        msg: 'GET ALL',
        total,
        producto
    })
}

//obtenerProducto - populate {}
const obtenerProducto = async (req, res) => {
    const id = req.params.id

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
    // const pop = await productos.populate();

    res.json({
        msg: 'GET ID',
        producto

    })
}
const crearProductos = async (req, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productorDB = await Producto.findOne({ nombre: body.nombre });

    if (productorDB) {
        return res.status(400).json({
            msg: `El producto ${productorDB.nombre}, ya existe`
        })
    }
   
    //Generar la data a guardar,el estado no se manda xq por defecto es true
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }
    const producto = new Producto( data );
    //Guardar DB
    await producto.save();

    res.status(201).json({
        msg: 'Post',
        producto
    })
}
//Actualizar producto
const actualizarProducto = async (req, res) => {

    const id = req.params.id;
    //eliminamos estos 2 parametros(estado,usuario)
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    //(busca el id, la data corregido, mande el documento actualizado)
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json({
        msg: 'Patch',
        producto
    })
}
//Borrar producto
const borrarProducto = async (req, res) => {

    const id = req.params.id;

    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });


    res.json({
        msg: 'Delete',
        productoBorrado
    })
}

module.exports = {
    crearProductos,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}