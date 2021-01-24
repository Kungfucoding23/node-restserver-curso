const express = require('express')


const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')


let app = express()

let Producto = require('../models/producto')

/*
    Obtener todos los productos
*/
app.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0
    desde = Number(desde)
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        })
})

/*
    Obtener un producto por ID
*/
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }
            if (!productoDB.disponible) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no está disponible'
                    }
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            })
        })
})

/*
    Buscar Productos
*/
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino

    // expresion regular para hacer flexible la busqueda
    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        })
})

/*
    Crear un producto
*/
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let body = req.body

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })
})

/*
    Actualiza producto
*/
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let body = req.body

    let actualizaProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        // categoria: body.categoria,
        disponible: body.disponible
    }
    Producto.findByIdAndUpdate(id, actualizaProducto, { new: true, runValidators: true }, (err, prodcutoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!prodcutoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: prodcutoDB
        });
    })
})

/*
    Borrar producto
*/
app.delete('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // pasar disponible a false
    let id = req.params.id

    let cambiaObj = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaObj, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoBorrado,
            mensaje: 'Producto borrado'
        })
    })
})

module.exports = app;