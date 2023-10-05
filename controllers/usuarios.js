const { response, request } = require('express');

const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {

    // const { q, nombre = 'No name', apikey} = req.query;
    //PAGINACIONCON LIMITE, DESDE POR CONSULTAS EN URL
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments(query);
    //aqui funciona con promise.all al mismo tiempo las promesas
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPut = async (req, res = response) => {

    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO validar contra base de datos
    if (password) {
        //encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
        // console.log("existe password");

    }

    // const usuario = await Usuario.findByIdAndUpdate( {id}, resto , {returnDocument: 'after'} );
    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

    res.status(400).json(usuario);
}

const usuariosPatch = (req, res) => {
    res.status(400).json({
        msg: 'patch API - usuariosPatch Controlador'
    })
}

const usuariosPost = async (req, res) => {



    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });


    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    //Guardar en la BD
    await usuario.save();

    res.status(201).json({
        msg: 'post API - usuariosPost Controlador',
        usuario
    });
}

const usuariosDelete = async (req, res) => {

    const id = req.params.id

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        id,
        usuario
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPatch,
    usuariosPost,
    usuariosDelete
}

