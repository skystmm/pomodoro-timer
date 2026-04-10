# Pomodoro Timer 🍅

Focus timer with reminders and calendar integration for OpenClaw.

## Features

- ⏱️ **Customizable Timer**: 25 min work + 5 min break (default, configurable)
- 🔔 **Reminders**: Start/end notifications, break suggestions
- 📅 **iCal Export**: Auto-export to Google/Apple Calendar
- 📊 **Statistics**: Track sessions, completion rate, daily/weekly reports
- 📋 **Feishu Calendar**: Create events and invite users

## Installation

```bash
# Clone the repository
git clone https://github.com/skystmm/pomodoro-timer.git ~/.openclaw/skills/pomodoro-timer

# Make script executable
chmod +x ~/.openclaw/skills/pomodoro-timer/scripts/pomodoro.sh
```

## Quick Start

### Basic Usage

```bash
# Start a 25-minute pomodoro
~/.openclaw/skills/pomodoro-timer/scripts/pomodoro.sh start "写代码"

# Start a 50-minute pomodoro
~/.openclaw/skills/pomodoro-timer/scripts/pomodoro.sh start "读论文" 50

# Check status
~/.openclaw/skills/pomodoro-timer/scripts/pomodoro.sh status

# Stop current pomodoro
~/.openclaw/skills/pomodoro-timer/scripts/pomodoro.sh stop

# View today's sessions
~/.openclaw/skills/pomodoro-timer/scripts/pomodoro.sh list today

# View statistics
~/.openclaw/skills/pomodoro-timer/scripts/pomodoro.sh stats 7
```

### Feishu Calendar Integration

```bash
# Create pomodoro and sync to Feishu calendar
~/.openclaw/skills/pomodoro-timer/scripts/pomodoro.sh start "开会" --feishu-calendar
```

**What happens:**
1. ✅ Creates a calendar event
2. ✅ Invites you as attendee
3. 📨 You receive Feishu notification
4. 📅 Event appears in your Feishu calendar

## Feishu Permission Requirements

To use the Feishu calendar integration, you need to configure permissions in [Feishu Open Platform](https://open.feishu.cn):

### Required Permissions

| Permission | Scope | Description |
|------------|-------|-------------|
| `calendar:calendar` | Read | Get calendar information |
| `calendar:calendar_event` | Write | Create calendar events |
| `calendar:calendar_event:attendee` | Write | Invite users to events |

### Configuration Steps

1. Log in to [Feishu Open Platform](https://open.feishu.cn)
2. Select your app
3. Go to **权限管理** (Permission Management)
4. Search and add the required permissions:
   - `calendar:calendar`
   - `calendar:calendar_event`
   - `calendar:calendar_event:attendee`
5. Wait for permission approval (if required)

### How It Works

The skill uses a two-step process to create events and invite users:

1. **Create Event**: Creates the calendar event
2. **Add Attendee**: Uses `calendarEventAttendee.create` API to invite you

This ensures you receive proper notifications and can see the event in your calendar.

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

## iCal Export

Sessions are automatically exported to iCal format:

**File location:** `~/.openclaw/pomodoro/calendar.ics`

**Import to Google Calendar:**
1. Go to Google Calendar → Settings
2. Import & Export → Import
3. Select `calendar.ics` file

**Import to Apple Calendar:**
1. File → Import
2. Select `calendar.ics`

## Troubleshooting

### No notification on completion
- Check if `notify-send` is installed (Linux)
- Check system notification settings

### Calendar file not created
- Ensure `~/.openclaw/pomodoro/` directory exists
- Check write permissions

### Feishu calendar not working
- Verify app has required permissions
- Check permission approval status
- Run test: `node scripts/feishu_calendar.js create-event "test"`

### Session not saved
- Check `log.json` file permissions
- Ensure disk space available

## API Reference

### Commands

| Command | Description |
|---------|-------------|
| `start <task> [duration]` | Start a pomodoro session |
| `stop` | Stop current pomodoro |
| `status` | Show current status |
| `list [today\|yesterday\|all]` | List sessions |
| `stats [days]` | Show statistics |

## License

MIT