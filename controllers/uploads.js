const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req, res = response) => {



  try {
    // const pathCompleto = await subirArchivo( req.files, ['txt','md'] , 'textos' );
    const pathCompleto = await subirArchivo(req.files, undefined, 'imgs');
    res.json({
      nombre: pathCompleto
    })
  } catch (msg) {
    res.status(400).json({ msg });
  }

}

const actualizarImagen = async (req, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }

      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }

      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' })
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);//borra el archivo
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre

  await modelo.save();

  res.json(modelo)

}
const actualizarImagenCloudinary = async (req, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }

      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }

      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' })
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[ nombreArr.length -1 ];
    const [ public_id ] = nombre.split('.');

    cloudinary.uploader.destroy( public_id );
  }

  // console.log(req.files.archivo);
  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath );


  // const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = secure_url

  await modelo.save();

  res.json(modelo)

}

const mostrarImagen = async (req, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }

      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }

      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' })
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }
  
  //pone el imagen por defecto
  const pathImagenDefault = path.join(__dirname, '../assets/no-image.jpg');
  // res.json({ msg: 'falta placeholder'})
  return res.sendFile(pathImagenDefault);



}

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary
}