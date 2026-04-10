const lark = require('/home/admin/.openclaw/extensions/feishu/node_modules/@larksuiteoapi/node-sdk');

// 飞书配置
const APP_ID = 'cli_a92cc69bba7a9bdb';
const APP_SECRET = 'vZRyj62CrZYzmZ9TCbNaxgGpDBl4xuBs';

const client = new lark.Client({
  appId: APP_ID,
  appSecret: APP_SECRET,
  appType: lark.AppType.SelfBuild,
});

// 获取主日历 ID
async function getPrimaryCalendar() {
  try {
    const response = await client.calendar.calendar.list({
      params: {
        page_size: 50
      }
    });
    
    if (response.code !== 0) {
      console.error('Error:', response.msg);
      return null;
    }
    
    const calendars = response.data?.calendars || [];
    const primary = calendars.find(c => c.type === 'primary');
    
    if (primary) {
      return primary.calendar_id;
    }
    
    // 如果没有 primary，返回第一个
    return calendars[0]?.calendar_id || null;
  } catch (error) {
    console.error('Failed to get calendar:', error.message);
    return null;
  }
}

// 创建日程
async function createEvent(summary, startTime, endTime, description = '') {
  try {
    // 获取主日历 ID
    const calendarId = await getPrimaryCalendar();
    
    if (!calendarId) {
      console.error('No calendar found');
      return null;
    }
    
    console.log('Using calendar:', calendarId);
    
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
        }
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
    case 'get-calendar':
      const calendarId = await getPrimaryCalendar();
      if (calendarId) {
        console.log('Primary calendar ID:', calendarId);
      } else {
        console.log('No calendar found');
      }
      break;
      
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
      console.log('  node feishu_calendar.js get-calendar');
      console.log('  node feishu_calendar.js create-event <summary> <startTime> <endTime> [description]');
  }
}

main();