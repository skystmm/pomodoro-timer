const lark = require('/home/admin/.openclaw/extensions/feishu/node_modules/@larksuiteoapi/node-sdk');
const fs = require('fs');

const APP_ID = 'cli_a92cc69bba7a9bdb';
const APP_SECRET = 'vZRyj62CrZYzmZ9TCbNaxgGpDBl4xuBs';
const TOKEN_FILE = '/home/admin/.openclaw/pomodoro/feishu_user_token.json';

const client = new lark.Client({
  appId: APP_ID,
  appSecret: APP_SECRET,
  appType: lark.AppType.SelfBuild,
});

// 生成授权链接
function generateAuthUrl() {
  const redirectUri = 'https://stxl117.top/pomodoro/callback';
  const params = new URLSearchParams({
    app_id: APP_ID,
    redirect_uri: redirectUri,
    scope: 'calendar:calendar calendar:calendar_event',
    state: 'pomodoro_' + Date.now()
  });
  
  return `https://open.feishu.cn/open-apis/authen/v1/authorize?${params.toString()}`;
}

// 用code换取token
async function exchangeCodeForToken(code) {
  try {
    console.log('Exchanging code for token...');
    
    const response = await client.authen.v1.accessToken.create({
      data: {
        grant_type: 'authorization_code',
        code: code
      }
    });
    
    if (response.code !== 0) {
      console.error('❌ Error:', response.msg);
      return null;
    }
    
    const data = response.data;
    
    // 保存token
    const token = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      expires_at: Date.now() + (data.expires_in * 1000),
      user_id: data.user_id,
      open_id: data.open_id,
      name: data.name,
      avatar_url: data.avatar_url
    };
    
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(token, null, 2));
    console.log('✅ Token saved successfully!');
    console.log('  User:', data.name);
    console.log('  Open ID:', data.open_id);
    
    return token;
    
  } catch (error) {
    console.error('❌ Failed:', error.message);
    return null;
  }
}

// 检查token状态
function checkToken() {
  if (!fs.existsSync(TOKEN_FILE)) {
    console.log('❌ No token found. Please authorize first.');
    return null;
  }
  
  const token = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
  const now = Date.now();
  
  if (now > token.expires_at) {
    console.log('❌ Token expired at:', new Date(token.expires_at).toLocaleString());
    console.log('Please re-authorize.');
    return null;
  }
  
  const remaining = Math.floor((token.expires_at - now) / 1000 / 60);
  console.log('✅ Valid token found');
  console.log('  User:', token.name);
  console.log('  Open ID:', token.open_id);
  console.log('  Expires in:', remaining, 'minutes');
  
  return token;
}

// 使用用户token创建日程
async function createEventWithUserToken(summary, startTime, endTime, description = '') {
  const token = checkToken();
  if (!token) {
    console.log('\n请先授权: node feishu_oauth.js auth');
    return null;
  }
  
  try {
    console.log('Creating event with user token...');
    
    // 使用用户token调用API
    const axios = require('axios');
    
    const response = await axios.post(
      'https://open.feishu.cn/open-apis/calendar/v4/calendars/primary/events',
      {
        summary: summary,
        description: description,
        need_notification: true,
        start_time: {
          timestamp: startTime.toString(),
          timezone: 'Asia/Shanghai'
        },
        end_time: {
          timestamp: endTime.toString(),
          timezone: 'Asia/Shanghai'
        },
        reminders: [{ minutes: 0 }]
      },
      {
        headers: {
          'Authorization': `Bearer ${token.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = response.data;
    
    if (data.code !== 0) {
      console.error('❌ Error:', data.msg);
      return null;
    }
    
    const eventId = data.data?.event?.event_id;
    console.log('✅ Event created in your calendar!');
    console.log('  Event ID:', eventId);
    
    return eventId;
    
  } catch (error) {
    console.error('❌ Failed:', error.response?.data || error.message);
    return null;
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const action = args[0];
  
  switch (action) {
    case 'auth':
      console.log('📋 飞书日历授权\n');
      console.log('步骤 1: 点击以下链接进行授权：\n');
      console.log(generateAuthUrl());
      console.log('\n步骤 2: 授权后，复制code参数，然后运行：');
      console.log('  node feishu_oauth.js exchange <code>');
      break;
      
    case 'exchange':
      const code = args[1];
      if (!code) {
        console.log('用法: node feishu_oauth.js exchange <code>');
        console.log('\n请从授权回调URL中复制code参数');
        break;
      }
      await exchangeCodeForToken(code);
      break;
      
    case 'check':
      checkToken();
      break;
      
    case 'create':
      const summary = args[1] || '番茄钟';
      const startTime = parseInt(args[2]) || Math.floor(Date.now() / 1000);
      const endTime = parseInt(args[3]) || startTime + 25 * 60;
      const description = args[4] || '';
      
      await createEventWithUserToken(summary, startTime, endTime, description);
      break;
      
    default:
      console.log('飞书日历 OAuth 授权工具\n');
      console.log('用法:');
      console.log('  node feishu_oauth.js auth              - 生成授权链接');
      console.log('  node feishu_oauth.js exchange <code>    - 用code换取token');
      console.log('  node feishu_oauth.js check              - 检查token状态');
      console.log('  node feishu_oauth.js create <title> <start> <end> - 创建日程');
  }
}

main();