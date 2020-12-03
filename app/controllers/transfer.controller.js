const db = require('../models');
const Transfer = db.transfer;

exports.create = (req, res) => {
    if (!req.params){
        res.status(400).send({message: "Información incompleta"});
    }

    const transfer = new Transfer({

    })
}

exports.getLastTransfer = (req, res) => {

}
