const db = require('../models');
const Account = db.account;

exports.findAccount = (req, res) => {
    const id = req.params.id;

    Account.findById(id)
        .then(data => {
            if (!data) res.status(404).send({message: "Cuenta no encontrada"});
            else res.send(data);
        }).catch(err => {
            res.status(500).send({message: "Error al intentar obtener cuenta"});
    })
}
