import { Base64 } from 'js-base64';

export async function onRequest(context) {
    const headers = context.request.headers;
    const key = headers.get('battle_log_key');

    const encoded = await context.env.BATTLE_LOGS.get(key);
    const decoded = Base64.decode(encoded);

    return new Response(decoded, { headers: { 'Content-Type': 'application/json' }});
}