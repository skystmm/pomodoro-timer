---
name: pomodoro-timer
description: "Pomodoro timer with reminders and calendar integration. Use when user asks to '设置番茄钟', '开始番茄钟', '番茄工作法', '定时提醒', or wants to track focused work sessions. Supports custom durations, break reminders, and iCal export. Optional Feishu calendar integration."
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
```

**With Feishu calendar:**
```
用户：设置番茄钟 coding，同步到飞书日程
助手：🍅 番茄钟已启动！
  📅 飞书日程已创建！
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

**iCal Export (Default)**

Sessions are automatically exported to iCal format:

**File location:** `~/.openclaw/pomodoro/calendar.ics`

**Import to Google Calendar:**
1. Go to Google Calendar → Settings
2. Import & Export → Import
3. Select `calendar.ics` file

**Import to Apple Calendar:**
1. File → Import
2. Select `calendar.ics`

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
  
  总计：2 个会话，50 分钟
```

### 5. Statistics

```
用户：番茄钟统计 7 天
助手：📊 番茄钟统计（近 7 天）
  总会话：28 次
  完成率：89%
  总时长：11h 40min
  日均：100 分钟
```

## Feishu Calendar Integration

**Usage:**
```bash
pomodoro.sh start "写代码" --feishu-calendar
```

**Created events include:**
- 🍅 emoji prefix
- Task name as summary
- Duration in description
- You as participant

**Viewing events:**
1. Open Feishu Calendar
2. Search for "🍅" or task name
3. Check "Other Calendars" section

**Configuration:**
- Requires `calendar:calendar` and `calendar:calendar_event` permissions
- Events are created in app calendar

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
| `--no-calendar` | Skip iCal export | `--no-calendar` |
| `--feishu-calendar` | Create Feishu event | `--feishu-calendar` |

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
助手：[执行] scripts/pomodoro.sh start "写代码"
```

### Custom Duration

```
用户：50 分钟番茄钟，研究论文
助手：[执行] scripts/pomodoro.sh start "研究论文" 50
```

### With Feishu Calendar

```
用户：番茄钟 开会，同步到飞书日程
助手：[执行] scripts/pomodoro.sh start "开会" --feishu-calendar
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

## Troubleshooting

**No notification on completion:**
- Check if `notify-send` is installed (Linux)
- Check system notification settings

**Calendar file not created:**
- Ensure `~/.openclaw/pomodoro/` directory exists
- Check write permissions

**Session not saved:**
- Check `log.json` file permissions
- Ensure disk space available