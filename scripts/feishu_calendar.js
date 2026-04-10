const lark = require('/home/admin/.openclaw/extensions/feishu/node_modules/@larksuiteoapi/node-sdk');

// 飞书配置
const APP_ID = 'cli_a92cc69bba7a9bdb';
const APP_SECRET = 'vZRyj62CrZYzmZ9TCbNaxgGpDBl4xuBs';

const client = new lark.Client({
  appId: APP_ID,
  appSecret: APP_SECRET,
  appType: lark.AppType.SelfBuild,
});

// 创建日程
async function createEvent(summary, startTime, endTime, description = '') {
  try {
    // 使用 primary 作为日历 ID（应用的主日历）
    // 注意：使用 tenant_access_token 创建的日程在应用的日历中
    // 用户需要订阅应用的日历才能看到，或者日程会自动出现在用户的"待办"中
    const calendarId = 'primary';
    
    console.log('Creating event in primary calendar...');
    console.log('Note: Events created with app token will be in app calendar.');
    console.log('Users can see them in Feishu Calendar or receive notifications.');
    
    const response = await client.calendar.calendarEvent.create({
      data: {
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
        reminders: [
          {
            minutes: 0  // 开始时提醒
          }
        ]
      },
      path: {
        calendar_id: calendarId
      }
    });
    
    if (response.code !== 0) {
      console.error('Error:', response.msg);
      return null;
    }
    
    const eventId = response.data?.event?.event_id;
    console.log('✅ Event created:', eventId);
    console.log('');
    console.log('📋 如何查看日程:');
    console.log('  1. 打开飞书日历');
    console.log('  2. 查看左侧日历列表，找到应用创建的日历');
    console.log('  3. 或者搜索日程标题');
    console.log('');
    console.log('💡 如果看不到日程，可能需要:');
    console.log('  - 检查飞书消息通知');
    console.log('  - 查看日历的"已邀请"列表');
    
    return eventId;
  } catch (error) {
    console.error('Failed to create event:', error.message);
    return null;
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const action = args[0];
  
  switch (action) {
    case 'create-event':
      const summary = args[1] || '番茄钟';
      const startTime = parseInt(args[2]) || Math.floor(Date.now() / 1000);
      const endTime = parseInt(args[3]) || startTime + 25 * 60;
      const description = args[4] || '';
      
      const eventId = await createEvent(summary, startTime, endTime, description);
      if (eventId) {
        console.log('Event ID:', eventId);
      }
      break;
      
    default:
      console.log('Usage:');
      console.log('  node feishu_calendar.js create-event <summary> <startTime> <endTime> [description]');
  }
}

main();