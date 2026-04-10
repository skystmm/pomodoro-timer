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

**Important Notes:**

日程创建成功后，用户可能需要在飞书日历中手动查看：

1. **打开飞书日历**
2. **查看左侧日历列表** - 找到应用创建的日历
3. **搜索日程标题** - 直接搜索"🍅 任务名"

**当前限制：**
- 使用应用身份创建日程，日程会在应用的日历中
- 用户需要订阅应用的日历，或在"已邀请"列表中查看
- 如果需要直接写入用户主日历，需要获取用户授权（user_access_token）

**使用方法：**
```
用户：设置番茄钟 写代码，同步到飞书日程
助手：[执行] scripts/pomodoro.sh start "写代码" --feishu-calendar
```

**查看日程：**
```
1. 打开飞书日历应用
2. 左侧日历列表中找到"平台开发"或应用名
3. 勾选显示该日历
4. 或直接搜索"🍅 写代码"
```

**配置要求：**
- App 已配置日历权限：`calendar:calendar:readonly` 和 `calendar:calendar_event:write`
- 日程会创建成功，但可能在应用的日历中而非用户主日历

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