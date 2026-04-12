const lark = require('/home/admin/.openclaw/extensions/feishu/node_modules/@larksuiteoapi/node-sdk');

const APP_ID = 'cli_a92cc69bba7a9bdb';
const APP_SECRET = 'vZRyj62CrZYzmZ9TCbNaxgGpDBl4xuBs';
const CHAT_ID = 'oc_781a5c7921505e2a42fe0f4d4c47df64';
const USER_ID = 'ou_5fb14b2ab73536f8719d9f92cb66831d'; // Sky

const client = new lark.Client({
  appId: APP_ID,
  appSecret: APP_SECRET,
  appType: lark.AppType.SelfBuild,
});

/**
 * 发送带 @ 的富文本消息
 * @param {string} text - 消息内容
 * @param {boolean} withMention - 是否 @ 用户
 */
async function sendMessage(text, withMention = true) {
  try {
    let content;
    
    if (withMention) {
      // 使用 post 类型消息，支持 @
      content = JSON.stringify({
        zh_cn: {
          title: '🍅 番茄钟提醒',
          content: [
            [
              {
                tag: 'at',
                user_id: USER_ID
              },
              {
                tag: 'text',
                text: ' ' + text
              }
            ]
          ]
        }
      });
      
      const response = await client.im.message.create({
        data: {
          receive_id: CHAT_ID,
          msg_type: 'post',
          content: content
        },
        params: {
          receive_id_type: 'chat_id'
        }
      });
      
      if (response.code === 0) {
        console.log('✅ Message sent with @mention!');
        return true;
      } else {
        console.error('Error:', response.msg);
        // 如果 post 类型失败，降级到纯文本
        return await sendFallbackText(text);
      }
    } else {
      // 纯文本消息
      content = JSON.stringify({
        text: text
      });
      
      const response = await client.im.message.create({
        data: {
          receive_id: CHAT_ID,
          msg_type: 'text',
          content: content
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
    }
  } catch (error) {
    console.error('Failed:', error.message);
    return false;
  }
}

async function sendFallbackText(text) {
  try {
    const response = await client.im.message.create({
      data: {
        receive_id: CHAT_ID,
        msg_type: 'text',
        content: JSON.stringify({ text: text })
      },
      params: {
        receive_id_type: 'chat_id'
      }
    });
    
    return response.code === 0;
  } catch (e) {
    return false;
  }
}

// 解析参数
const args = process.argv.slice(2);
const text = args[0] || '番茄钟完成！休息一下吧~';
const noMention = args.includes('--no-mention');

sendMessage(text, !noMention);