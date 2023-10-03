const { response } = require('express');


const usuariosGet = (req, res = response) => {

    const { q, nombre = 'No name', apikey} = req.query;

    res.json({
        msg: 'get API - usuariosGet Controlador',
        q,
        nombre,
        apikey
    })
}

const usuariosPut = (req, res) => {

    const id = req.params.id;

    res.status(400).json({
        msg: 'put API - usuariosPut Controlador',
        id
    })
}

const usuariosPatch = (req, res) => {
    res.status(400).json({
        msg: 'patch API - usuariosPatch Controlador'
    })
}

const usuariosPost = (req, res) => {

    const { nombre, edad } = req.body;

    res.status(201).json({
        msg: 'post API - usuariosPost Controlador',
        nombre,
        edad
    })
}

const usuariosDelete = (req, res) => {
    res.json({
        msg: 'delete API - controlador'
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPatch,
    usuariosPost,
    usuariosDelete
}

