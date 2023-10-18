const { default: mongoose } = require('mongoose');
const Role = require('../models/role');
const usuario = require('../models/usuario');
const { Categoria, Producto } = require('../models');


const esRoleValido = async(rol = '') =>{
    const existeRol = await Role.findOne({ rol });
    if(!existeRol){
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
} 


const emailExiste = async (correo = '') => {
    //  Verificar si el correo existe
    const existeEmail = await usuario.findOne({ correo });
    if( existeEmail ) {
        throw new Error(`El correo: ${correo} ya esta registrado`);
    }
}
const existeUsuarioPorId = async (id = '') => {
    //  Verificar si el id existe
    const existeUsuario = await usuario.findById( id );
    if( !existeUsuario ) {
        throw new Error(`El id no existe: ${id}`);
    }
}
/** Categorias */
const existeCategoriaPorId = async (id = '') => {
    console.log(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`El id no es válido: ${id}`);
    }

    // Verificar si el id existe
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id no existe: ${id}`);
    }
}
/** Productos */
const existeProductoPorId = async (id = '') => {
    console.log(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`El id no es válido: ${id}`);
    }

    // Verificar si el id existe
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id no existe: ${id}`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}