# Pomodoro Timer 🍅

Focus timer with reminders and calendar integration for OpenClaw.

## Features

- ⏱️ **Customizable Timer**: 25 min work + 5 min break (default, configurable)
- 🔔 **Reminders**: Start/end notifications, break suggestions
- 📅 **Calendar Integration**: Auto-export to iCal format
- 📊 **Statistics**: Track sessions, completion rate, daily/weekly reports

## Installation

```bash
# Copy to your OpenClaw skills directory
cp -r pomodoro-timer ~/.openclaw/skills/

# Make script executable
chmod +x ~/.openclaw/skills/pomodoro-timer/scripts/pomodoro.sh
```

## Usage

### Start a Pomodoro

```
用户：帮我设置一个番茄钟，我要写代码
助手：🍅 番茄钟已启动！
  任务：写代码
  时长：25 分钟
  结束时间：15:40
```

### Custom Duration

```
用户：50 分钟番茄钟，研究论文
助手：🍅 50 分钟番茄钟已启动！
```

### Check Status

```
用户：番茄钟还有多久
助手：🍅 番茄钟进行中
  剩余时间：18:32
```

### View History

```
用户：今天做了几个番茄钟
助手：📋 今日番茄钟记录
  1. ✅ 15:15 | 25min | 写代码
  2. ✅ 16:00 | 25min | 写代码
  总计：2 个会话，50 分钟
```

### Statistics

```
用户：这周番茄钟统计
助手：📊 番茄钟统计（近 7 天）
  总会话：28 次
  完成率：89%
  总时长：11h 40min
```

## Calendar Integration

Sessions are automatically exported to iCal:

```
~/.openclaw/pomodoro/calendar.ics
```

Import to Google Calendar, Apple Calendar, or any iCal-compatible app.

## Files

```
~/.openclaw/pomodoro/
├── current.json    # Active session
├── log.json        # Session history
└── calendar.ics    # iCal export
```

## Script Usage

```bash
# Start session
./scripts/pomodoro.sh start "写代码" 25

# Check status
./scripts/pomodoro.sh status

# Stop session
./scripts/pomodoro.sh stop

# List sessions
./scripts/pomodoro.sh list today

# Show statistics
./scripts/pomodoro.sh stats 7
```

## Options

| Option | Description | Example |
|--------|-------------|---------|
| `--work=N` | Work duration (minutes) | `--work=50` |
| `--break=N` | Break duration (minutes) | `--break=10` |
| `--no-calendar` | Skip calendar export | `--no-calendar` |

## Requirements

- Bash
- Python 3
- `notify-send` (Linux, for notifications)

## License

MIT