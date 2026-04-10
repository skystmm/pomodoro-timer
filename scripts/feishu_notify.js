const lark = require('/home/admin/.openclaw/extensions/feishu/node_modules/@larksuiteoapi/node-sdk');

const APP_ID = 'cli_a92cc69bba7a9bdb';
const APP_SECRET = 'vZRyj62CrZYzmZ9TCbNaxgGpDBl4xuBs';
const CHAT_ID = 'oc_781a5c7921505e2a42fe0f4d4c47df64';

const client = new lark.Client({
  appId: APP_ID,
  appSecret: APP_SECRET,
  appType: lark.AppType.SelfBuild,
});

async function sendMessage(text) {
  try {
    const response = await client.im.message.create({
      data: {
        receive_id: CHAT_ID,
        msg_type: 'text',
        content: JSON.stringify({
          text: text
        })
      },
      params: {
        receive_id_type: 'chat_id'
      }
    });
    
    if (response.code === 0) {
      console.log('✅ Message sent!');
      return true;
    } else {
      console.error('Error:', response.msg);
      return false;
    }
  } catch (error) {
    console.error('Failed:', error.message);
    return false;
  }
}

const args = process.argv.slice(2);
const text = args[0] || '🍅 番茄钟完成！';

sendMessage(text);