#!/bin/bash
# Stream Dashboard Service Management Script
# Provides convenient commands for managing the systemd service

set -e

SERVICE_NAME="stream-dashboard"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

function print_usage() {
  cat <<EOF
Usage: $(basename "$0") <command>

Commands:
  install     Install systemd service
  uninstall   Remove systemd service
  start       Start the service
  stop        Stop the service
  restart     Restart the service
  status      Show service status
  logs        Show service logs (follow mode)
  enable      Enable auto-start on login
  disable     Disable auto-start
  check       Check if service is running

Examples:
  $(basename "$0") install
  $(basename "$0") start
  $(basename "$0") logs
EOF
}

function check_systemd() {
  if ! command -v systemctl &> /dev/null; then
    echo -e "${RED}Error: systemctl not found. This script requires systemd.${NC}"
    exit 1
  fi
}

function ensure_linger() {
  local linger_status
  linger_status=$(loginctl show-user "$(whoami)" --property=Linger 2>/dev/null || echo "Linger=unknown")

  if [[ "$linger_status" == "Linger=no" ]]; then
    echo -e "${YELLOW}Enabling user linger (required for service persistence)...${NC}"
    loginctl enable-linger "$(whoami)"
    echo -e "${GREEN}✓ User linger enabled${NC}"
  fi
}

function install_service() {
  echo -e "${YELLOW}Installing systemd service...${NC}"

  local systemd_dir="$HOME/.config/systemd/user"
  local service_src="$ROOT_DIR/systemd/${SERVICE_NAME}.service"
  local service_dest="$systemd_dir/${SERVICE_NAME}.service"

  # Create systemd user directory
  mkdir -p "$systemd_dir"

  # Check if service file exists
  if [[ ! -f "$service_src" ]]; then
    echo -e "${RED}Error: Service file not found: $service_src${NC}"
    exit 1
  fi

  # Copy service file, replacing %h with $HOME
  sed "s|%h|$HOME|g" "$service_src" > "$service_dest"

  echo -e "${GREEN}✓ Service file installed: $service_dest${NC}"

  # Reload systemd
  systemctl --user daemon-reload
  echo -e "${GREEN}✓ Systemd daemon reloaded${NC}"

  # Enable linger for service persistence
  ensure_linger

  echo ""
  echo "Service installed successfully!"
  echo "Next steps:"
  echo "  Start service:  $0 start"
  echo "  Enable auto-start: $0 enable"
}

function uninstall_service() {
  echo -e "${YELLOW}Uninstalling systemd service...${NC}"

  local service_dest="$HOME/.config/systemd/user/${SERVICE_NAME}.service"

  # Stop service if running
  if systemctl --user is-active "$SERVICE_NAME" &> /dev/null; then
    echo "Stopping service..."
    systemctl --user stop "$SERVICE_NAME"
  fi

  # Disable service if enabled
  if systemctl --user is-enabled "$SERVICE_NAME" &> /dev/null; then
    echo "Disabling service..."
    systemctl --user disable "$SERVICE_NAME"
  fi

  # Remove service file
  if [[ -f "$service_dest" ]]; then
    rm "$service_dest"
    echo -e "${GREEN}✓ Service file removed${NC}"
  fi

  # Reload systemd
  systemctl --user daemon-reload
  echo -e "${GREEN}✓ Systemd daemon reloaded${NC}"

  echo "Service uninstalled successfully!"
}

function start_service() {
  echo -e "${YELLOW}Starting $SERVICE_NAME service...${NC}"
  systemctl --user start "$SERVICE_NAME"
  echo -e "${GREEN}✓ Service started${NC}"

  # Wait a moment and check status
  sleep 1
  if systemctl --user is-active "$SERVICE_NAME" &> /dev/null; then
    echo -e "${GREEN}✓ Service is running${NC}"
  else
    echo -e "${RED}✗ Service failed to start${NC}"
    echo "Check logs with: $0 logs"
    exit 1
  fi
}

function stop_service() {
  echo -e "${YELLOW}Stopping $SERVICE_NAME service...${NC}"
  systemctl --user stop "$SERVICE_NAME"
  echo -e "${GREEN}✓ Service stopped${NC}"
}

function restart_service() {
  echo -e "${YELLOW}Restarting $SERVICE_NAME service...${NC}"
  systemctl --user restart "$SERVICE_NAME"
  echo -e "${GREEN}✓ Service restarted${NC}"

  # Wait a moment and check status
  sleep 1
  if systemctl --user is-active "$SERVICE_NAME" &> /dev/null; then
    echo -e "${GREEN}✓ Service is running${NC}"
  else
    echo -e "${RED}✗ Service failed to restart${NC}"
    echo "Check logs with: $0 logs"
    exit 1
  fi
}

function show_status() {
  systemctl --user status "$SERVICE_NAME" --no-pager
}

function show_logs() {
  echo -e "${YELLOW}Showing logs for $SERVICE_NAME (Ctrl+C to exit)...${NC}"
  journalctl --user -u "$SERVICE_NAME" -f
}

function enable_service() {
  echo -e "${YELLOW}Enabling auto-start for $SERVICE_NAME...${NC}"
  systemctl --user enable "$SERVICE_NAME"
  echo -e "${GREEN}✓ Service will auto-start on login${NC}"
}

function disable_service() {
  echo -e "${YELLOW}Disabling auto-start for $SERVICE_NAME...${NC}"
  systemctl --user disable "$SERVICE_NAME"
  echo -e "${GREEN}✓ Auto-start disabled${NC}"
}

function check_service() {
  if systemctl --user is-active "$SERVICE_NAME" &> /dev/null; then
    echo -e "${GREEN}✓ Service is running${NC}"
    return 0
  else
    echo -e "${RED}✗ Service is not running${NC}"
    return 1
  fi
}

# Main execution
check_systemd

if [[ $# -eq 0 ]]; then
  print_usage
  exit 1
fi

COMMAND="$1"

case "$COMMAND" in
  install)
    install_service
    ;;
  uninstall)
    uninstall_service
    ;;
  start)
    start_service
    ;;
  stop)
    stop_service
    ;;
  restart)
    restart_service
    ;;
  status)
    show_status
    ;;
  logs)
    show_logs
    ;;
  enable)
    enable_service
    ;;
  disable)
    disable_service
    ;;
  check)
    check_service
    ;;
  *)
    echo -e "${RED}Error: Unknown command: $COMMAND${NC}"
    echo ""
    print_usage
    exit 1
    ;;
esac
