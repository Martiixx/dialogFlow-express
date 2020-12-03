module.exports = mongoose => {
    const Schema = mongoose.Schema;
    const Transfer = require('./transfer.model.js');

    const Account = mongoose.model("account",
        mongoose.Schema({
                account_number: Number,
                balance: Number,
                transfers: [{type: Schema.Types.ObjectId, ref:'Transfer'}]
            },
            {
                timestamps: true
            })
    );

    return Account;
}
