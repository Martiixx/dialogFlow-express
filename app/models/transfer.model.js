module.exports = mongoose => {
    const Transfer = mongoose.model("transfer",
        mongoose.Schema({
            initial_balance: Number,
            final_balance: Number,
            amount: Number,
            cod_auth: String
        },
        {
            timestamps: true
        })
    );

    return Transfer;
}
