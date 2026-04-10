const lark = require('/home/admin/.openclaw/extensions/feishu/node_modules/@larksuiteoapi/node-sdk');

const APP_ID = 'cli_a92cc69bba7a9bdb';
const APP_SECRET = 'vZRyj62CrZYzmZ9TCbNaxgGpDBl4xuBs';
const USER_OPEN_ID = 'ou_5fb14b2ab73536f8719d9f92cb66831d';

const client = new lark.Client({
  appId: APP_ID,
  appSecret: APP_SECRET,
  appType: lark.AppType.SelfBuild,
});

// 步骤1: 创建日程
async function createEvent(summary, startTime, endTime, description = '') {
  try {
    console.log('Step 1: Creating event...');
    
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
        reminders: [{ minutes: 0 }]
      },
      path: {
        calendar_id: 'primary'
      }
    });
    
    if (response.code !== 0) {
      console.error('Create event error:', response.msg);
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

// 步骤2: 邀请用户加入日程
async function addAttendee(calendarId, eventId) {
  try {
    console.log('Step 2: Adding attendee...');
    
    const response = await client.calendar.calendarEventAttendee.create({
      data: {
        attendees: [
          {
            type: 'user',
            user_id: USER_OPEN_ID
          }
        ],
        need_notification: true  // 发送通知
      },
      path: {
        calendar_id: calendarId,
        event_id: eventId
      },
      params: {
        user_id_type: 'open_id'
      }
    });
    
    if (response.code !== 0) {
      console.error('Add attendee error:', response.msg);
      console.log('Full error:', JSON.stringify(response, null, 2));
      return false;
    }
    
    console.log('✅ Attendee added!');
    console.log('  User should receive notification now.');
    
    return true;
    
  } catch (error) {
    console.error('Failed to add attendee:', error.message);
    return false;
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
      
      // 步骤1: 创建日程
      const eventId = await createEvent(summary, startTime, endTime, description);
      
      if (eventId) {
        // 步骤2: 邀请用户
        const success = await addAttendee('primary', eventId);
        
        if (success) {
          console.log('Event ID:', eventId);
          console.log('');
          console.log('📋 完成流程:');
          console.log('  1. ✅ 日程已创建');
          console.log('  2. ✅ 已邀请你加入日程');
          console.log('  3. 📨 应该会收到飞书通知');
        } else {
          console.log('Event ID:', eventId);
          console.log('⚠️ 邀请失败，日程已创建但用户可能收不到通知');
        }
      }
      break;
      
    default:
      console.log('Usage:');
      console.log('  node feishu_calendar.js create-event <summary> <startTime> <endTime> [description]');
  }
}

main();