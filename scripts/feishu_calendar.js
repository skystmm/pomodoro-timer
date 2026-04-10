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
    const calendarId = 'primary';
    
    console.log('Creating event in primary calendar...');
    
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
        reminders: [{ minutes: 0 }],
        // 添加用户为参与者
        attendees: [
          {
            type: 'user',
            user_id: 'ou_5fb14b2ab73536f8719d9f92cb66831d',
            option: 'accept'
          }
        ]
      },
      path: {
        calendar_id: calendarId
      },
      params: {
        user_id_type: 'open_id'
      }
    });
    
    if (response.code !== 0) {
      console.error('Error:', response.msg);
      return null;
    }
    
    const eventId = response.data?.event?.event_id;
    console.log('✅ Event created:', eventId);
    console.log('');
    console.log('📋 查看日程方式:');
    console.log('  1. 打开飞书日历');
    console.log('  2. 查看左侧"其他日历"或搜索日程标题');
    console.log('  3. 日程已添加你为参与者');
    console.log('');
    console.log('💡 提示: 使用用户授权后日程会直接在你的日历中');
    
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