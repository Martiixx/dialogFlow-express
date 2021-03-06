module.exports = mongoose => {
    const Schema = mongoose.Schema;

    const Transfer = mongoose.model("transfers",
        mongoose.Schema({
                initial_balance: Number,
                final_balance: Number,
                amount: Number,
                cod_auth: String,
                destination_bank: String,
                account_type: String,
                account_number: Number
            },
            {
                timestamps: true
            })
    );

    const Account = mongoose.model("account",
        mongoose.Schema({
                account_number: Number,
                balance: Number,
                transfers: [Transfer.schema],
            },
            {
                timestamps: true
            })
    );

    const User = mongoose.model("user",
        mongoose.Schema({
                name: String,
                rut: String,
                password: String,
                mail: String,
                account: Account.schema,
            },
            {
                timestamps: true
            })
    );

    return User;
}
