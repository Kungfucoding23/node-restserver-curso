const jwt = require('jsonwebtoken')

/*
    Verificar TOKEN
*/
let verificaToken = (req, res, next) => {

    let token = req.get('token')

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                    ok: false,
                    err: {
                        message: 'Token no valido'
                    }
                }) //401 no autorizado
        }
        // si llega hasta aca, significa que la info es correcta y el decoded va a contenter la info del usuario
        req.usuario = decoded.usuario
    })

    next()

}

/*
    Verifica AdminRole
*/
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario

    if (usuario.role === 'ADMIN_ROLE') {
        next()
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

}

/*
    Verifica Token para Imagen
*/
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                    ok: false,
                    err: {
                        message: 'Token no valido'
                    }
                }) //401 no autorizado
        }
        req.usuario = decoded.usuario
    })

    next()
}


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}