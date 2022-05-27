const mysql = require('../mysql');

exports.getCategorias = async (req, res, next) => {
    try {
        const result = await mysql.execute("SELECT * FROM categorias;")
        const response = {
            length: result.length,
            categorias: result.map(categoria => {
                return {
                    id_categoria: categoria.id_categoria,
                    nome: categoria.nome
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
};

exports.postCategoria = async (req, res, next) => {
    try {
        const query = 'INSERT INTO categorias (nome) VALUES (?)';
        const result = await mysql.execute(query, [req.body.nome]);
        
        const response = {
            mensagem : 'Categoria Inserida com  sucesso',
            CategoriaCriada: {
                id_categoria: result.insertId,
                nome: req.body.nome,
                request: {
                    tipo: 'GET',
                    descrição: 'Retorna todas as categorias ',
                    url: process.env.URL_API + 'categorias'
                }
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error});
    }
};

exports.updateCategoria = async (req, res, next) => {

    try {
        const query =  `UPDATE    categorias
                            SET nome       =?
                        WHERE id_categoria   =?`
        await mysql.execute(query,[
            req.body.nome,
            req.body.id_categoria
        ]);
        const response = {
            mensagem : 'Produto atualizado com sucesso',
            produtoAtualizado: {
                id_categoria: req.body.id_categoria,
                nome: req.body.nome,

                request: {
                    tipo: 'GET',
                    descrição: 'retorna os detalhes de uma categoria específica',
                    url: process.env.URL_API + 'categorias/' + req.body.id_categoria
                }
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};