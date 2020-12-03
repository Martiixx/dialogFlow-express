module.exports = mongoose => {
    const Schema = mongoose.Schema;
    const Account = require('./account.model');

    const User = mongoose.model("user",
        mongoose.Schema({
                name: String,
                rut: String,
                password: String,
                mail: String,
                account: {type: Schema.Types.ObjectId, ref:'Account'}
            },
            {
                timestamps: true
            })
    );

    return User;
}
