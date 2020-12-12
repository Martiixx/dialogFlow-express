db.createUser(
    {
        user: 'user',
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
            }
        }
    }
);
