---
name: pomodoro-timer
description: "Pomodoro timer with reminders and calendar integration. Use when user asks to '设置番茄钟', '开始番茄钟', '番茄工作法', '定时提醒', or wants to track focused work sessions. Supports custom durations, break reminders, exports to iCal, and Feishu calendar integration."
---

# Pomodoro Timer 🍅

Focus timer with reminders and calendar integration.

## Quick Start

**Start a pomodoro:**
```
用户：帮我设置一个番茄钟，我要写代码
助手：🍅 番茄钟已启动！
  任务：写代码
  时长：25 分钟
  结束时间：15:38

  会话 ID: pomodoro-12345
  📅 已写入日历
```

**Start with Feishu calendar:**
```
用户：设置一个番茄钟，同步到飞书日程
助手：🍅 番茄钟已启动！
  任务：专注工作
  时长：25 分钟
  
  📅 飞书日程已创建！
    Event ID: evt_xxx
```

**Check status:**
```
用户：番茄钟状态
助手：🍅 番茄钟进行中
  任务：写代码
  已开始：15:13
  剩余时间：12:34
```

## Trigger Phrases

- 设置番茄钟
- 开始番茄钟
- 番茄工作
- 帮我定时
- 专注工作
- 查看番茄钟状态
- 停止番茄钟
- 今日番茄钟
- 番茄钟统计
- 同步到飞书日程
- 写入飞书日历

## Features

### 1. Customizable Timer

**Default:** 25 min work + 5 min break

**Custom:**
```
用户：设置一个 50 分钟的番茄钟，我要读论文
助手：🍅 50 分钟番茄钟已启动！

用户：30 分钟番茄钟，10 分钟休息，写文档
助手：🍅 番茄钟已启动！
  时长：30 分钟
  休息：10 分钟
```

### 2. Reminders

- **Start notification**: Confirms session started
- **End notification**: System notification when time's up
- **Break reminder**: Suggests break duration

### 3. Calendar Integration

Sessions automatically saved to iCal format:
```
~/.openclaw/pomodoro/calendar.ics
```

Import to:
- Google Calendar
- Apple Calendar
- Outlook
- Any calendar app supporting iCal

### 4. Session Tracking

All sessions logged to:
```
~/.openclaw/pomodoro/log.json
```

View history:
```
用户：今日番茄钟
助手：📋 今日番茄钟记录
  1. ✅ 15:13 | 25min | 写代码
  2. ✅ 16:00 | 25min | 写代码
  3. ⏹️ 17:30 | 15min | 邮件 (中断)
  
  总计：3 个会话，65 分钟
```

### 5. Statistics

```
用户：番茄钟统计 7 天
助手：📊 番茄钟统计（近 7 天）
  总会话：28 次
  完成率：89%
  总时长：11h 40min
  日均：100 分钟
  
  📅 每日详情：
  04-10: 125min 🍅🍅🍅🍅🍅
  04-09: 100min 🍅🍅🍅🍅
  04-08: 150min 🍅🍅🍅🍅🍅🍅🍅
```

## Workflow

### Start Session

1. **Extract task name** from user input
2. **Extract duration** if specified (default: 25 min)
3. **Extract break duration** if specified (default: 5 min)
4. **Execute script**: `scripts/pomodoro.sh start "<task>" <duration>`
5. **Output**: Session info + calendar confirmation

### Check Status

1. **Execute script**: `scripts/pomodoro.sh status`
2. **Parse output**: Remaining time, task, status
3. **Format response**: User-friendly display

### Stop Session

1. **Execute script**: `scripts/pomodoro.sh stop`
2. **Confirm**: Task stopped, duration shown

### View History

1. **Execute script**: `scripts/pomodoro.sh list [today|yesterday|all]`
2. **Format table**: Sessions with status indicators

### View Statistics

1. **Execute script**: `scripts/pomodoro.sh stats [days]`
2. **Display**: Total sessions, completion rate, daily breakdown

## Commands Reference

| Command | Script | Description |
|---------|--------|-------------|
| 开始番茄钟 | `pomodoro.sh start <task> [duration]` | Start session |
| 停止番茄钟 | `pomodoro.sh stop` | Stop current session |
| 番茄钟状态 | `pomodoro.sh status` | Show current status |
| 今日番茄钟 | `pomodoro.sh list today` | Today's sessions |
| 番茄钟统计 | `pomodoro.sh stats [days]` | Statistics |

## Options

| Option | Description | Example |
|--------|-------------|---------|
| `--work=N` | Work duration (minutes) | `--work=50` |
| `--break=N` | Break duration (minutes) | `--break=10` |
| `--no-calendar` | Skip calendar export | `--no-calendar` |

## Files

```
~/.openclaw/pomodoro/
├── current.json    # Active session
├── log.json        # Session history
└── calendar.ics    # iCal export
```

## Examples

### Basic Usage

```
用户：设置番茄钟 写代码
助手：[执行] scripts/pomodoro.sh start "写代码" 25
```

### Custom Duration

```
用户：50 分钟番茄钟，研究论文
助手：[执行] scripts/pomodoro.sh start "研究论文" 50
```

### With Break Setting

```
用户：30 分钟番茄钟，5 分钟休息，写文档
助手：[执行] scripts/pomodoro.sh start "写文档" --work=30 --break=5
```

### Check Progress

```
用户：番茄钟还有多久
助手：[执行] scripts/pomodoro.sh status
```

### Stop Early

```
用户：停止番茄钟
助手：[执行] scripts/pomodoro.sh stop
```

### Review Day

```
用户：今天做了几个番茄钟
助手：[执行] scripts/pomodoro.sh list today
```

### Weekly Review

```
用户：这周番茄钟统计
助手：[执行] scripts/pomodoro.sh stats 7
```

## Calendar Integration

### iCal Export (Default)

Sessions are automatically exported to iCal format:

**File location:** `~/.openclaw/pomodoro/calendar.ics`

**Import to Google Calendar:**
1. Go to Google Calendar → Settings
2. Import & Export → Import
3. Select `calendar.ics` file

**Import to Apple Calendar:**
1. File → Import
2. Select `calendar.ics`

**Calendar event format:**
```
BEGIN:VEVENT
SUMMARY:🍅 写代码
DTSTART:20260410T151300
DTEND:20260410T153800
DESCRIPTION:Pomodoro session - 25 minutes
CATEGORIES:Pomodoro
BEGIN:VALARM
TRIGGER:-PT0M
ACTION:DISPLAY
DESCRIPTION:Pomodoro ended!
END:VALARM
END:VEVENT
```

### Feishu Calendar Integration

**重要说明：** 要将日程写入用户主日历，需要用户授权。

#### 快速授权流程

**步骤 1: 获取授权链接**
```
用户：授权飞书日历
助手：[生成授权链接]
```

**步骤 2: 点击链接授权**
- 在浏览器中打开授权链接
- 点击"允许"授权飞书日历访问

**步骤 3: 复制授权码**
- 授权后会跳转到回调页面
- 从URL中复制 `code` 参数
- 告诉我：`授权码: xxx`

**步骤 4: 完成授权**
```
用户：授权码: oaxxxxxxx
助手：✅ 授权成功！现在日程会写入你的日历。
```

#### 命令行方式

```bash
cd ~/.openclaw/skills/pomodoro-timer/scripts

# 1. 生成授权链接
node feishu_oauth.js auth

# 2. 用授权码换取token
node feishu_oauth.js exchange <code>

# 3. 检查授权状态
node feishu_oauth.js check
```

#### 配置要求

**飞书开放平台配置：**

1. 登录 https://open.feishu.cn
2. 选择应用「平台开发」
3. 安全设置 → 重定向 URL → 添加：
   ```
   https://stxl117.top/pomodoro/callback
   ```
4. 权限管理 → 添加权限：
   - `calendar:calendar` - 获取日历
   - `calendar:calendar_event` - 创建日程

#### 使用

授权成功后：
```
用户：设置番茄钟 写代码，同步到飞书日程
助手：🍅 番茄钟已启动！
  📅 日程已写入你的飞书日历！
```

---

**授权链接：**
```
https://open.feishu.cn/open-apis/authen/v1/authorize?app_id=cli_a92cc69bba7a9bdb&redirect_uri=https%3A%2F%2Fstxl117.top%2Fpomodoro%2Fcallback&scope=calendar%3Acalendar+calendar%3Acalendar_event
```

## Troubleshooting

**No notification on completion:**
- Check if `notify-send` is installed (Linux)
- Check system notification settings

**Calendar file not created:**
- Ensure `~/.openclaw/pomodoro/` directory exists
- Check write permissions

**Feishu calendar not working:**
- Check app has `calendar:calendar:readonly` and `calendar:calendar_event:write` permissions
- Check user has authorized the app
- Run `node scripts/feishu_calendar.js get-calendar` to test

**Session not saved:**
- Check `log.json` file permissions
- Ensure disk space available