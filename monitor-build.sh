#!/bin/bash
# Android Build Status Monitor for PV Construction Platform
# Usage: monitor-build.sh [interval]

INTERVAL=${1:-"5"}
LOG_FILE="build.log"
ALERT_FILE="build_alerts.log"

echo "📱 PV Construction Platform Build Monitor"
echo "📊 Monitoring: $LOG_FILE"
echo "⏱️  Update interval: $INTERVAL seconds"
echo "🔔 Alerts: $ALERT_FILE"
echo "----------------------------------------"

# Initialize alert file
echo "Build monitoring started: $(date)" > $ALERT_FILE

while true; do
    # Check if log file exists
    if [ ! -f "$LOG_FILE" ]; then
        echo "⚠️  Log file not found. Waiting..."
        sleep $INTERVAL
        continue
    fi

    # Get current status
    LAST_LINE=$(tail -n 1 "$LOG_FILE")
    BUILD_STATUS=$(grep -o "✅ BUILD SUCCESSFUL\|❌ BUILD FAILED" "$LOG_FILE" | tail -n 1)
    CURRENT_PHASE=$(grep "Phase.*completed" "$LOG_FILE" | tail -n 1)
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

    # Display current status
    echo "[$TIMESTAMP] Status: ${BUILD_STATUS:-'In Progress'}"
    if [ -n "$CURRENT_PHASE" ]; then
        echo "[$TIMESTAMP] Current: $CURRENT_PHASE"
    fi
    echo "[$TIMESTAMP] Last: $LAST_LINE"
    echo "----------------------------------------"

    # Check for errors
    if grep -q "❌" "$LOG_FILE" && [ -z "$BUILD_SUCCESSFUL" ]; then
        echo "🚨 ERROR DETECTED!"
        echo "[$TIMESTAMP] Error found in build log" >> $ALERT_FILE
        tail -n 20 "$LOG_FILE" | grep -A 5 -B 5 "❌" >> $ALERT_FILE
        echo "----------------------------------------"
    fi

    # Check for completion
    if echo "$BUILD_STATUS" | grep -q "SUCCESSFUL"; then
        echo "🎉 BUILD COMPLETED SUCCESSFULLY!"
        echo "[$TIMESTAMP] Build completed successfully" >> $ALERT_FILE
        # Send notification (if Termux notification is available)
        termux-notification --title "Build Complete" --content "PV Construction Platform build completed successfully"
        break
    fi

    # Check for hanging
    if [ -n "$LAST_LINE" ] && [[ "$LAST_LINE" == *"Phase"*"completed"* ]]; then
        PHASE_WAIT_TIME=$((SECONDS - PHASE_START_TIME))
        if [ $PHASE_WAIT_TIME -gt 300 ]; then  # 5 minutes
            echo "⏰ Phase taking longer than expected: $PHASE_WAIT_TIME seconds"
            echo "[$TIMESTAMP] Phase taking longer than expected: $PHASE_WAIT_TIME seconds" >> $ALERT_FILE
        fi
    fi

    sleep $INTERVAL
done

echo "📊 Final build summary:"
echo "========================================"
echo "Start time: $(head -n 1 "$LOG_FILE")"
echo "End time: $(tail -n 1 "$LOG_FILE")"
echo "Total build time: $((SECONDS / 60)) minutes"
echo "Alerts logged to: $ALERT_FILE"

# Generate final report
echo "📋 Generating final report..."
{
    echo "PV Construction Platform Build Report"
    echo "===================================="
    echo "Generated: $(date)"
    echo ""
    echo "Build Log Summary:"
    echo "-----------------"
    grep "✅\|❌\|📝\|🔧\|🤖\|🎨\|💰\|🚀\|📚" "$LOG_FILE" | sort
    echo ""
    echo "Error Analysis:"
    echo "--------------"
    grep -A 3 -B 3 "❌\|Error\|Failed\|Exception" "$LOG_FILE" | sort -u
    echo ""
    echo "Phase Completion:"
    echo "-----------------"
    grep "Phase.*completed" "$LOG_FILE" | sort
    echo ""
    echo "Resource Usage:"
    echo "---------------"
    echo "Memory: $(free -m | grep Mem | awk '{print $3 "/" $2 " MB (" $3/$2*100 "%)"}')"
    echo "Disk: $(df -h . | tail -1 | awk '{print $3 "/" $2 " (" $5 " used)"}')"
    echo "CPU: $(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $0 "% idle")}')"
} > build_report.txt

echo "📄 Report generated: build_report.txt"
echo "🎯 Monitoring complete!"