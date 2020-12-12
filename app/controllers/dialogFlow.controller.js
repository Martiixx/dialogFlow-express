const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const UserController = require('./user.controller.js');
const https = require('https');
const pdf = require('html-pdf');


async function detectIntent(
    projectId,
    sessionId,
    query,
    contexts,
    languageCode
) {
    // The path to identify the agent that owns the created intent.
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
    );

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: languageCode,
            },
        },
    };

    if (contexts && contexts.length > 0) {
        request.queryParams = {
            contexts: contexts,
        };
    }

    const responses = await sessionClient.detectIntent(request);
    return responses[0];
}

async function executeSingleQuery(projectId, sessionId, query, languageCode) {
    let context;
    let intentResponse;
    try {
        console.log(`Sending Query: ${query}`);
        intentResponse = await detectIntent(
            projectId,
            sessionId,
            query,
            context,
            languageCode
        );
        console.log('Detected intent');
        console.log(
            `Fulfillment Text: ${intentResponse.queryResult.fulfillmentMessages}`
        );
        let response = intentResponse.queryResult.fulfillmentMessages[0];
        console.log(JSON.stringify(response));
        console.log(response['text']) // response conversation
        console.log(response['payload']) // response action
        if (response['text'] !== undefined) {
            let message = response['text'];
            return message.text[0]; // return content of text object
        } else if (response['payload'] !== undefined) {
            let action = response['payload'].fields.action.stringValue;
            if (action === 'getUserData') {
                console.log('in')
                return await UserController.getUserData().then(data => {
                    return 'Su saldo en la cuenta es $' + data.account.balance
                });
            } else if (action === 'getIndicadores') {
                let data = await getIndicadores();
                return 'Los valores del dia son ' + data;
            } else if (action === 'createTransaction') {
                let parameters = intentResponse.queryResult.parameters.fields;
                let destination = {
                    account_type: parameters.account_type.stringValue,
                    destination_bank: parameters.destination_bank.stringValue,
                    account_number: parameters.account_number.numberValue,
                    amount: parameters.amount.numberValue
                }
                let transfer = await UserController.createTransaction(destination);
                console.log(transfer);
                if (typeof transfer === 'string') { // not enough cash
                    return transfer;
                }
                let file = await generatePdf(transfer);
                console.log(file);
                return {response: 'Transferencia realizada con éxito.', file: file}
            }
        }
    } catch (error) {
        console.log(error);
        return 'Ha ocurrido un error al procesar la información. intente nuevamente';
    }
}

exports.startDialog = async (req, res) => {
    console.log(req.query[0]);
    const projectId = 'agentebanco-gdrm';
    const sessionId = '12345';
    const query = req.query[0]; /* req.params.message; */
    const languageCode = 'es';

    let response = await executeSingleQuery(projectId, sessionId, query, languageCode);
    // executeQueries(projectId, sessionId, queries, languageCode);
    res.status(200).send({message: response});
}

function getIndicadores() {
    https.get('https://mindicador.cl/api', (response) => {
        response.setEncoding('utf-8');
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });
        let responseData = '';
        response.on('end', () => {
            let parsedData = JSON.parse(data);
            responseData = {
                uf: parsedData.uf.valor,
                utm: parsedData.utm.valor,
                dolar: parsedData.dolar.valor,
                euro: parsedData.euro.valor,
            }
            console.log(JSON.stringify(responseData));
        })
        return responseData;
    }).on('error', (err) => {
        return err;
     })
}

function generatePdf(transfer) {
    const content = `
        <h1> Transferencia Bancaria </h1>
        <p>Banco de destino: ${transfer.destination_bank}</p>
        <p>Cuenta de destino: ${transfer.account_number}</p>
        <p>Tipo de cuenta: ${transfer.account_type}</p>
        <p>Monto: ${transfer.amount}</p>
        <p>Codigo Autorizacion: ${transfer.cod_auth}</p>
        <p>Fecha: ${new Date()}</p>
    `;

    return pdf.create(content).toFile('./Transferencia' + Math.floor(Math.random() * 1000) + '.pdf',(err, res) => {
        if (err) {
            console.log(err);
        } else {
            return res.filename;
        }
    });
}
