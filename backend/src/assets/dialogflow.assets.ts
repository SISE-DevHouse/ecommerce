import * as DialogFlow from 'dialogflow';
import * as Uuid from 'uuid';
import { CONFIG_GOOGLE } from '../config/dialogflow.config';

let credentials = {
    client_email: CONFIG_GOOGLE.client_email,
    private_key: CONFIG_GOOGLE.private_key,
};

let sessionClient;


export function DialogFlowInit() {
    sessionClient = new DialogFlow.SessionsClient({
        projectId: CONFIG_GOOGLE.project_id,
        credentials,
    });
}


export async function SendDialogFlow(NumberPhone: string, sendText: string): Promise<string> {

    // La session sera el numero de telefono del cliente.
    const sessionId = NumberPhone;
    const sessionPath = sessionClient.sessionPath(CONFIG_GOOGLE.project_id, sessionId);

    // Armamos el query para las consultas.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: sendText,
                languageCode: 'es',
            },
        },
    };


    // Enviar 
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);

    if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
    } else {
        console.log(`  No intent matched.`);
    }

    return result.fulfillmentText;
}

