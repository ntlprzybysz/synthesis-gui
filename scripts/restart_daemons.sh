#!/bin/bash

# Restarts all daemon services used for the GUI Speech Synthesis. 
# Please run with: 'sudo sh restart_daemons.sh'

# Checks status of a service
check_status () {
	local service=$1
	systemctl is-active --quiet $service
	local status=$?
    return $status
}

# Restarts a service and checks its status. If the restart
# wasn't successful, the script is terminated.
restart_daemon () {
	local service=$1
	echo "Restarting $service..."
	systemctl restart $service
    check_status $service
    local status=$?
	if [ $status -eq 0 ]; then
		echo "$service is active."
    else
        echo "$service couldn't be activated, please consult logs for details. Terminating script."
		exit 1
	fi        

}

# Change the working directory to the script location (if needed).
# Replace ~/synthesis-gui/scripts/ with your actual script directory.
cd ~/synthesis-gui/scripts/

restart_daemon "gunicorn"
restart_daemon "nginx"
restart_daemon "rabbitmq-server"
restart_daemon "celery"
restart_daemon "celery-beat"

echo "All daemons have been restarted."