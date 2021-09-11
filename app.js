const express = require('express');
const app = express();
const morgan = require('morgan');


const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
const rotaUsuarios = require('./routes/usuarios');


app.use(morgan('dev'));
app.use(express.urlencoded({extended: true})); 
app.use(express.json());   

app.use(( req, res, next) => {
    res.header('Acces-Control-Allow-Origin', '*');
    res.header(
        'Acces-Control-Allow-Header',
        'Origin, X-Requrested-With, Content-Type, Accept, Authorization'
    );

    if(req.method === 'OPITIONS') {
        res.header('Acces-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);
app.use('/usuarios', rotaUsuarios);

app.use((req, res, next) => {
    const erro = new Error('Não encontado');
    erro.status=404;
    next(erro);
 });

 app.use((error, req, res, next) => {
     res.status(error.status || 500);
     return res.send({
         erro: {
             mensagem: error.message
         }
     });
 });

module.exports = app;