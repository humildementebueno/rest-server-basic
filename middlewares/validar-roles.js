const { request, response } = require("express")

const esAdminRole = (req = request, res = response, next)=>{
    
    if(!req.usuario){
        return res.status(500).json({
            msg: 'Se require verificar el role sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuario;

    if( rol !== 'ADMIN_ROLE'){
        return res.status(401).send({
            msg: `${nombre} no es administrador - No puede hacer esto`
        });
    }

    next();
}

const tieneRole = ( ...roles) => {
    return (req = request, res = response, next) => {
        console.log(roles, req.usuario.rol);
        //este casi siempre se repite y lo verificamos para lo del token
        if(!req.usuario){
            return res.status(500).json({
                msg: 'Se require verificar el role sin validar el token primero'
            });
        }
        
        if(!roles.includes( req.usuario.rol )){
            return res.status(401).json({
                msg: `Se require verificar uno de estos roles ${roles}`
            });
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}
