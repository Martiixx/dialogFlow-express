const db = require("../models");
const User = db.user;
const https = require('https');

exports.createTransaction = (req, res) => {
    if (!req.params.amount) {
        res.status(400).send({message: "Content cannot be empty"})
    }

    let user = User.findOne().sort({created_at: -1}).exec();

    if ((user.account.balance - req.params.amount) < 0) {
        res.status(400).send({message: ""});
    }

    const transaction = {
        initial_balance: user.account.balance,
        final_balance: user.account.balance - req.params.amount,
        amount: req.params.amount,
        cod_auth: 'authorization-code',
    }

    user.account.transfer.push(transaction);
    user.save().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({message: err.message || "Error ocurred trying to save the transaction"});
    });
}

exports.getUserData = (req, res) => {
    let user = User.findOne().sort({created_at: -1}).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({message: err.message || "Error ocurred trying to get the user"});
    });
}

exports.getTransactionPdf = (req, res) => {

}

exports.getIndicators = (req, res) => {
    https.get('https://mindicador.cl/api', (response) => {
        response.setEncoding('utf-8');
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            let parsedData = JSON.parse(data);
            let responseData = {
                uf: parsedData.uf.valor,
                utm: parsedData.utm.valor,
                dolar: parsedData.dolar.valor,
            }
            res.send(responseData);
        })
    }).on('error', (err) => {
        res.status(500).send({message: "Error retrieving data from mindicador.cl"});
    })
}
