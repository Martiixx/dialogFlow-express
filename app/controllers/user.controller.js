const db = require("../models");
const User = db.user;
const https = require('https');

exports.createTransaction = async (destination) => {
    let user = await User.findOne().then(data => {
        return data;
    });

    if (user.account.balance < destination.amount) {
        return 'No posees el saldo suficiente para completar la transacción.'
    }

    const transaction = {
        initial_balance: user.account.balance,
        final_balance: user.account.balance - destination.amount,
        amount: destination.amount,
        cod_auth: 'authorization-code',
        account_type: destination.account_type,
        account_number: destination.account_number,
        destination_bank: destination.destination_bank,
    }

    user.account.transfers.push(transaction);
    user.account.balance = transaction.final_balance;
    user.save().then(data => {
        return data;
    }).catch(err => {
        return 'Error al procesar la solicitud:' + err;
    });

    return transaction;
}

// exports.getUserData = (req, res) => {
//     let user = User.findOne().then(data => {
//         console.log(data);
//         res.status(200).send(data);
//     }).catch(err => {
//         res.status(500).send({message: err.message || "Error ocurred trying to get the user"});
//     });
// }

exports.initUser = (req, res) => {
    const user = new User({
        name: 'Martin',
        rut: '11.111.111-1',
        password: 'password',
        mail: 'mail@mail.cl',
        account: {
            account_number: 123,
            balance: 120000,
            transfers: {
                initial_balance: 125000,
                final_balance: 120000,
                amount: 5000,
                cod_auth: 'Authorization-code',
                destination_bank: 'Banco Estado',
                account_type: 'Cuenta vista',
                account_number: 555555,
            }
        }
    });

    user.save(user).then(data => {
        console.log('User created.');
        res.status(200).send(data);
    }).catch(error => {
        console.log(JSON.stringify(error));
        res.status(500).send(error);
    });
}

exports.getIndicators = async () => {
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
                euro: parsedData.euro.valor,
            }
            return responseData;
        })
    }).on('error', (err) => {
        res.status(500).send({message: "Error retrieving data from mindicador.cl"});
    })
}

exports.getUserData = () => {
    return User.findOne().then(data => {
        return data;
    }).catch(err => {
        return err;
    });
}
