const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/' , (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos;',
            (error , result, field) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantdade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descrição: 'retorna os detalhes de um produto específico',
                                url: proces.env.URL_API + 'produtos/' + prod.id_produto
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    });
});

router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?,?)',
            [req.body.nome, req.body.preco],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem : 'Produto inserido com sucesso',
                    ProdutoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descrição: 'Retorna todos os produtos ',
                            url: proces.env.URL_API + 'produtos'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    });
});

router.get('/:id_produto', (req, res, next)=> {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?;',
            [req.params.id_produto],
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o produto com esse ID'
                    })
                }
                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: 'GET',
                            descrição: 'Retorna todos os produtos ',
                            url: proces.env.URL_API + 'produtos'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
});
 
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE produtos
                SET nome       =?,
                    preco      =?
            WHERE id_produto   =?`,
                [
                    req.body.nome,
                    req.body.preco,
                    req.body.id_produto
                ],
                (error, resultado, field) => {
                    conn.release();
                    if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem : 'Produto atualizado com sucesso',
                    produtoAtualizado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descrição: 'retorna os detalhes de um produto específico',
                            url: proces.env.URL_API + 'produtos/' + req.body.id_produto
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});

router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM produto WHERE id_produto = ?`,[req.body.id_produto],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        url: proces.env.URL_API + 'produtos',
                        body: {
                            nome: 'String',
                            preco: 'Number'
                        }

                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});

module.exports = router;


