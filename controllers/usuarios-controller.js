const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');

exports.cadastrarUsuario = (req, res, next) => {
    console.log(req.file);
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (error, results) => {
            if (error) { return res.status(500).send({ error: error }) }
            if (results.length > 0) {
                res.status(409).send({ mesangem: 'Usuario ja cadastrado' })
            } else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    conn.query(
                        'INSERT INTO usuarios ( nome, email, senha, imagem_usuarios) VALUES (?,?,?,?)',
                    [
                        req.body.nome,
                        req.body.email,
                        hash,
                        req.file.path
                    ],
                    (error, results) => {
                        conn.release();
                        if (error) { return res.status(500).send({ error: error }) }
                        response = {
                            mesangem: 'Usuário criado com sucesso',
                            usuarioCriado: {
                                id_usuario: results.insertId,
                                nome: req.body.nome,
                                email: req.body.email,
                                imagem_usuarios: req.file.path,
                            },

                        }
                        return res.status(201).send(response);
                    })
                });
            }
        })
    });
};

exports.getUsuarios = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM usuarios;',
            (error , result, field) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    usuarios: result.map(prod => {
                        return {
                            id_usuario: prod.id_usuario,
                            nome: prod.nome,
                            email: prod.email,
                            senha: prod.senha,
                            imagem_usuarios: result[0].imagem_usuarios,
                            request: {
                                tipo: 'GET',
                                descrição: 'retorna os detalhes de um produto específico',
                                url: process.env.URL_API + 'usuarios/' + req.body.id_usuario
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    });
};

exports.Login = (req, res, next) =>{
    console.log(req.file);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        const query = `SELECT * FROM usuarios WHERE email = ?`;
        conn.query(query,[req.body.email],(error, results, fields) => {
             conn.release();
             if(error) { return res.status(500).send({ error: error }) }
             if (results.length <1){
                 return res.status(401).send({ mensagem: 'Falha no login' })
             }
             bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                 if (err) {
                    return res.status(401).send({ mensagem: 'Falha no login' })
                 }
                 if (result) {
                     const token = jwt.sign({
                         id_usuario: results[0].id_usuario,
                         email: results[0].email
                     }, 
                     process.env.JWT_KEY,
                     {
                    
                     });
                     return res.status(200).send({ 
                         mensagem: 'Autenticado com sucesso',
                     });
                 }
                 return res.status(401).send({ mensagem: 'Falha no login' })
             });
        });
    });
};

exports.deleteUsuario = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM usuarios WHERE id_usuario = ?`,[req.body.id_usuario],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Usuario removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um usuario',
                        url: process.env.URL_API + 'usuarios',
                        body: {
                           email:'string',
                           senha:'string',
                           nome:'string'
                        }

                    }
                }
                return res.status(202).send(response);
            }
        )
    });
};