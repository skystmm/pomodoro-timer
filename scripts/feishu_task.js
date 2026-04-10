const lark = require('/home/admin/.openclaw/extensions/feishu/node_modules/@larksuiteoapi/node-sdk');

const APP_ID = 'cli_a92cc69bba7a9bdb';
const APP_SECRET = 'vZRyj62CrZYzmZ9TCbNaxgGpDBl4xuBs';
const USER_OPEN_ID = 'ou_5fb14b2ab73536f8719d9f92cb66831d';

const client = new lark.Client({
  appId: APP_ID,
  appSecret: APP_SECRET,
  appType: lark.AppType.SelfBuild,
});

// 创建飞书任务
async function createTask(summary, dueTime, description = '') {
  try {
    const response = await client.task.task.create({
      data: {
        summary: summary,
        description: description,
        due: dueTime ? {
          timestamp: dueTime.toString(),
          timezone: 'Asia/Shanghai'
        } : undefined,
        collaborator_ids: [USER_OPEN_ID],
        follower_ids: [USER_OPEN_ID],
        origin: {
          platform_i18n_name: 'Pomodoro Timer'
        }
      },
      params: {
        user_id_type: 'open_id'
      }
    });
    
    if (response.code !== 0) {
      console.error('Error:', response.msg);
      return null;
    }
    
    const taskId = response.data?.task?.id;
    console.log('✅ Task created:', taskId);
    
    return taskId;
    
  } catch (error) {
    console.error('Failed to create task:', error.message);
    return null;
  }
}

// 完成任务
async function completeTask(taskId) {
  try {
    const response = await client.task.task.complete({
      path: {
        task_id: taskId
      }
    });
    
    return response.code === 0;
    
  } catch (error) {
    console.error('Failed to complete task:', error.message);
    return false;
  }
}

// 列出任务
async function listTasks() {
  try {
    const response = await client.task.task.list({
      params: {
        page_size: 20,
        user_id_type: 'open_id'
      }
    });
    
    if (response.code !== 0) {
      return [];
    }
    
    return response.data?.tasks || [];
    
  } catch (error) {
    console.error('Failed to list tasks:', error.message);
    return [];
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const action = args[0];
  
  switch (action) {
    case 'create':
      const summary = args[1] || '番茄钟';
      const dueMinutes = parseInt(args[2]) || 25;
      const dueTime = Math.floor(Date.now() / 1000) + (dueMinutes * 60);
      const description = args[3] || '';
      
      const taskId = await createTask(summary, dueTime, description);
      if (taskId) {
        console.log('Task ID:', taskId);
      }
      break;
      
    case 'complete':
      const tid = args[1];
      if (!tid) {
        console.log('Usage: node feishu_task.js complete <task_id>');
        break;
      }
      const success = await completeTask(tid);
      console.log(success ? '✅ Task completed' : '❌ Failed');
      break;
      
    case 'list':
      const tasks = await listTasks();
      console.log('📋 Tasks:', tasks.length);
      tasks.forEach((t, i) => {
        const status = t.complete_time ? '✅' : '⏳';
        console.log(`${i + 1}. ${status} ${t.summary}`);
      });
      break;
      
    default:
      console.log('Feishu Task Manager');
      console.log('  create <summary> [due_minutes] [description]');
      console.log('  complete <task_id>');
      console.log('  list');
  }
}

main();