#!/bin/bash
# Pomodoro Timer Script
# Simplified version - keeps core features only

set -e

POMODORO_DIR="$HOME/.openclaw/pomodoro"
LOG_FILE="$POMODORO_DIR/log.json"
CALENDAR_FILE="$POMODORO_DIR/calendar.ics"

# Default durations (minutes)
DEFAULT_WORK=25
DEFAULT_SHORT_BREAK=5

# Ensure directory exists
mkdir -p "$POMODORO_DIR"

# Initialize log file if not exists
if [ ! -f "$LOG_FILE" ]; then
    echo '{"sessions": []}' > "$LOG_FILE"
fi

# Usage function
usage() {
    echo "Usage: $0 <action> [options]"
    echo ""
    echo "Actions:"
    echo "  start <task> [duration]  Start a pomodoro session"
    echo "  stop                     Stop current pomodoro"
    echo "  status                   Show current status"
    echo "  list [date]              List sessions for a date"
    echo "  stats [days]             Show statistics"
    echo ""
    echo "Options:"
    echo "  --work=N                 Set work duration (default: $DEFAULT_WORK min)"
    echo "  --break=N                Set break duration (default: $DEFAULT_SHORT_BREAK min)"
    echo "  --no-calendar            Skip iCal export"
    echo "  --feishu-calendar        Create event in Feishu calendar"
    echo ""
    echo "Examples:"
    echo "  $0 start '写代码' 25"
    echo "  $0 start '开会' --feishu-calendar"
    echo "  $0 status"
    echo "  $0 list today"
    exit 1
}

# Get current timestamp
timestamp() {
    date +%s
}

# Format timestamp to ISO 8601
format_time() {
    local ts=$1
    date -d "@$ts" '+%Y-%m-%d %H:%M:%S'
}

# Generate iCal content
generate_ical() {
    local task="$1"
    local start_ts="$2"
    local end_ts="$3"
    local duration="$4"
    
    local uid="pomodoro-$(date +%s)-$$@openclaw"
    
    cat <<EOF
BEGIN:VEVENT
UID:$uid
DTSTAMP:$(date -d "@$start_ts" '+%Y%m%dT%H%M%S')
DTSTART:$(date -d "@$start_ts" '+%Y%m%dT%H%M%S')
DTEND:$(date -d "@$end_ts" '+%Y%m%dT%H%M%S')
SUMMARY:🍅 $task
DESCRIPTION:Pomodoro session - ${duration} minutes
CATEGORIES:Pomodoro
BEGIN:VALARM
TRIGGER:-PT0M
ACTION:DISPLAY
DESCRIPTION:Pomodoro ended!
END:VALARM
END:VEVENT
EOF
}

# Save session to log
save_session() {
    python3 << EOF
import json

with open('$LOG_FILE', 'r') as f:
    data = json.load(f)

session = {
    'task': '$1',
    'start': $2,
    'end': $3,
    'duration': $4,
    'status': '$5'
}

data['sessions'].append(session)

with open('$LOG_FILE', 'w') as f:
    json.dump(data, f, indent=2)
EOF
}

# Start a pomodoro session
start_pomodoro() {
    local task="$1"
    local duration="${2:-$DEFAULT_WORK}"
    local break_duration="${3:-$DEFAULT_SHORT_BREAK}"
    local no_calendar="${4:-false}"
    local feishu_calendar="${5:-false}"
    
    local start_ts=$(timestamp)
    local end_ts=$((start_ts + duration * 60))
    
    # Create session file
    cat > "$POMODORO_DIR/current.json" << EOF
{
    "task": "$task",
    "start": $start_ts,
    "end": $end_ts,
    "duration": $duration,
    "break_duration": $break_duration,
    "status": "running"
}
EOF
    
    echo "🍅 Pomodoro Started!"
    echo "  Task: $task"
    echo "  Duration: ${duration} minutes"
    echo "  End time: $(format_time $end_ts)"
    echo ""
    echo "Session ID: pomodoro-$$"
    
    # Save to log
    save_session "$task" "$start_ts" "$end_ts" "$duration" "started"
    
    # Generate iCal entry
    if [ "$no_calendar" != "true" ]; then
        generate_ical "$task" "$start_ts" "$end_ts" "$duration" >> "$CALENDAR_FILE"
        echo ""
        echo "📅 iCal entry saved to: $CALENDAR_FILE"
    fi
    
    # Create Feishu calendar event
    if [ "$feishu_calendar" = "true" ]; then
        local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        local event_id=$(node "$script_dir/feishu_calendar.js" create-event "🍅 $task" "$start_ts" "$end_ts" "番茄钟 - ${duration}分钟" 2>&1 | grep "Event ID:" | awk '{print $3}')
        
        if [ -n "$event_id" ]; then
            echo "📅 飞书日程已创建！"
            echo "  Event ID: $event_id"
        else
            echo "⚠️ 飞书日程创建失败"
        fi
    fi
    
    # Send notification at the end (background)
    (
        sleep $((duration * 60))
        
        # Update status
        if [ -f "$POMODORO_DIR/current.json" ]; then
            python3 - "$POMODORO_DIR/current.json" << 'PYEOF'
import json
import sys
with open(sys.argv[1], 'r') as f:
    data = json.load(f)
data['status'] = 'completed'
with open(sys.argv[1], 'w') as f:
    json.dump(data, f, indent=2)
PYEOF
        fi
        
        notify-send "🍅 Pomodoro Complete!" "Time for a ${break_duration} minute break!" 2>/dev/null || true
        save_session "$task" "$start_ts" "$end_ts" "$duration" "completed"
        
    ) &
    
    echo ""
    echo "⏰ You will be notified when the pomodoro ends."
}

# Stop current pomodoro
stop_pomodoro() {
    if [ ! -f "$POMODORO_DIR/current.json" ]; then
        echo "❌ No active pomodoro session."
        exit 1
    fi
    
    local current=$(cat "$POMODORO_DIR/current.json")
    
    local task=$(echo "$current" | python3 -c "import json,sys; print(json.load(sys.stdin)['task'])")
    local start_ts=$(echo "$current" | python3 -c "import json,sys; print(json.load(sys.stdin)['start'])")
    
    python3 - "$POMODORO_DIR/current.json" << 'EOF'
import json
import sys
with open(sys.argv[1], 'r') as f:
    data = json.load(f)
data['status'] = 'stopped'
data['end'] = int(__import__('datetime').datetime.now().timestamp())
with open(sys.argv[1], 'w') as f:
    json.dump(data, f, indent=2)
EOF
    
    echo "⏹️ Pomodoro stopped!"
    echo "  Task: $task"
    echo "  Started: $(format_time $start_ts)"
    
    pkill -f "pomodoro-$$" 2>/dev/null || true
}

# Show current status
show_status() {
    if [ ! -f "$POMODORO_DIR/current.json" ]; then
        echo "📭 No active pomodoro session."
        exit 0
    fi
    
    python3 - "$POMODORO_DIR/current.json" << 'PYEOF'
import json
import sys
from datetime import datetime

with open(sys.argv[1], 'r') as f:
    data = json.load(f)

if data.get('status') != 'running':
    print(f"❌ Pomodoro {data.get('status', 'unknown')}")
    sys.exit(0)

task = data['task']
start = data['start']
end = data['end']
duration = data['duration']

now = int(datetime.now().timestamp())
remaining = end - now

if remaining <= 0:
    print("✅ Pomodoro completed!")
    print(f"   Task: {task}")
    sys.exit(0)

mins = remaining // 60
secs = remaining % 60

print(f"🍅 Pomodoro in Progress")
print(f"   Task: {task}")
print(f"   Duration: {duration} minutes")
print(f"   Remaining: {mins:02d}:{secs:02d}")
PYEOF
}

# List sessions
list_sessions() {
    python3 << 'PYEOF'
import json
from datetime import datetime, timedelta

with open('$LOG_FILE', 'r') as f:
    data = json.load(f)

sessions = data.get('sessions', [])

# Filter by date
date_filter = '$1'
if date_filter and date_filter != 'all':
    now = datetime.now()
    if date_filter == 'today':
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        start_ts = int(start.timestamp())
    elif date_filter == 'yesterday':
        start = (now - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        start_ts = int(start.timestamp())
    else:
        start_ts = 0
    
    sessions = [s for s in sessions if s['start'] >= start_ts]

if not sessions:
    print("📭 No sessions found.")
    exit(0)

print(f"📋 Pomodoro Sessions ({date_filter or 'all'})")
print("=" * 60)

total_minutes = 0
for i, s in enumerate(reversed(sessions[-20:]), 1):
    task = s['task'][:30]
    start = datetime.fromtimestamp(s['start']).strftime('%m-%d %H:%M')
    duration = s['duration']
    status = '✅' if s.get('status') == 'completed' else '⏹️'
    
    print(f"{i:2}. {status} {start} | {duration}min | {task}")
    total_minutes += duration

print("=" * 60)
print(f"Total: {len(sessions)} sessions, {total_minutes} minutes")
PYEOF
}

# Show statistics
show_stats() {
    python3 << 'PYEOF'
import json
from datetime import datetime, timedelta

with open('$LOG_FILE', 'r') as f:
    data = json.load(f)

sessions = data.get('sessions', [])
days = $1

now = datetime.now()
start = now - timedelta(days=days)
start_ts = int(start.timestamp())

recent = [s for s in sessions if s['start'] >= start_ts]

if not recent:
    print(f"📭 No sessions in the last {days} days.")
    exit(0)

total_sessions = len(recent)
total_minutes = sum(s['duration'] for s in recent)
completed = len([s for s in recent if s.get('status') == 'completed'])

print(f"📊 Pomodoro Statistics (Last {days} days)")
print("=" * 50)
print(f"  Total sessions: {total_sessions}")
print(f"  Completed: {completed} ({completed*100//total_sessions if total_sessions else 0}%)")
print(f"  Total time: {total_minutes} minutes ({total_minutes//60}h {total_minutes%60}m)")
print(f"  Daily average: {total_minutes//days if days else 0} minutes")
PYEOF
}

# Parse arguments
ACTION="${1:-help}"
shift || true

case "$ACTION" in
    start)
        TASK="$1"
        DURATION=""
        BREAK_DUR=""
        NO_CALENDAR="false"
        FEISHU_CALENDAR="false"
        
        shift || true
        
        while [ $# -gt 0 ]; do
            case "$1" in
                --work=*)
                    DURATION="${1#*=}"
                    ;;
                --break=*)
                    BREAK_DUR="${1#*=}"
                    ;;
                --no-calendar)
                    NO_CALENDAR="true"
                    ;;
                --feishu-calendar)
                    FEISHU_CALENDAR="true"
                    ;;
                *)
                    if [ -z "$DURATION" ] && [[ "$1" =~ ^[0-9]+$ ]]; then
                        DURATION="$1"
                    fi
                    ;;
            esac
            shift
        done
        
        if [ -z "$TASK" ]; then
            echo "❌ Error: Task name required"
            usage
        fi
        
        start_pomodoro "$TASK" "${DURATION:-$DEFAULT_WORK}" "${BREAK_DUR:-$DEFAULT_SHORT_BREAK}" "$NO_CALENDAR" "$FEISHU_CALENDAR"
        ;;
    
    stop)
        stop_pomodoro
        ;;
    
    status)
        show_status
        ;;
    
    list)
        DATE_FILTER="${1:-today}"
        list_sessions "$DATE_FILTER"
        ;;
    
    stats)
        DAYS="${1:-7}"
        show_stats "$DAYS"
        ;;
    
    help|--help|-h)
        usage
        ;;
    
    *)
        echo "❌ Unknown action: $ACTION"
        usage
        ;;
esac