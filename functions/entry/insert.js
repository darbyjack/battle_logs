import { Base64 } from 'js-base64';
import { v4 as uuidv4 } from 'uuid';

export async function onRequest(context) {
    const data = await context.request.json();
    const encoded = Base64.encode(JSON.stringify(data));
    const uuid = uuidv4();
    await context.env.BATTLE_LOGS.put(uuid, encoded);
    console.log(`Inserted ${uuid} into Battle Logs`);
    return new Response(JSON.stringify({ id: uuid }));
}