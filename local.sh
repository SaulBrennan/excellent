pid=$(lsof -t -i:1000)
if [ ! -z "$pid" ]; then
    echo "Process using port 1000 found. PID: $pid"
    echo "Killing process..."
    kill $pid
    sleep 2
    echo "Process killed."
else
    echo "No process found using port 1000."
fi
echo "Starting Node.js server..."
node server.js