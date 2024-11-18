import { createClient } from 'redis';
import http from 'http';
import { Server } from 'socket.io';

const httpServer = http.createServer();
const io = new Server(httpServer);

const redisSubscriber = createClient();

(async () => {
    try {
      
        await redisSubscriber.connect();
        await redisSubscriber.subscribe("publisherEvent", (receivedData) => {
            try {
                const parsedData = JSON.parse(receivedData); 
                console.log(`Data received from publisher: ${JSON.stringify(parsedData)}`);
                 //server side emit client side catch
                io.emit("socketEmit", parsedData); // now for complete socket// later for particular user 
                console.log("Emitted the data to WebSocket clients.", new Date().toLocaleString());
            } catch (err) {
                console.error("Error processing received data:", err.message);
            }
        });


        httpServer.listen(4000, () => {
            console.log("WebSocket server is running on port 4000");
        });
    } catch (e) {
        console.log("Error:", e.message);
        process.exit(1); 
    }
})();

