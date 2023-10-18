const { response, request } = require('express');
const { Categoria } = require('../models');


//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async ( req, res ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, categoria] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    // const categorias = await Categoria.findOne({});
    
    res.json({
        msg: 'GET ALL',
        total,
        categoria
    })
}

//obtenerCategoria - populate {}
const obtenerCategoria = async ( req, res ) => {
    const id = req.params.id

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    // const pop = await categorias.populate();

    res.json({
        msg: 'GET ID',
        categoria
        
    })
}
const crearCategorias = async ( req, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        })
    }
    //Generar la data a guardar,el estado no se manda xq por defecto es true
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = new Categoria( data );
    //Guardar DB
    await categoria.save();

    res.status(201).json({
        msg: 'Post',
        categoria
    })
}
//Actualizar categoria
const actualizarCategoria = async ( req, res ) => {
    
    const id = req.params.id;
    //eliminamos estos 2 parametros(estado,usuario)
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    //(busca el id, la data corregido, mande el documento actualizado)
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true} );

    // categoria.nombre = nombre;
    // categoria.estado = estado;
    // categoria.usuario = usuario;

    res.json({
        msg: 'Patch',
        categoria
    })
}
//Borrar categoria
const borrarCategoria = async ( req, res ) => {

    const id = req.params.id;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false },{new: true});


    res.json({
        msg: 'Delete',
        categoria
    })
}

module.exports = {
    crearCategorias,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}