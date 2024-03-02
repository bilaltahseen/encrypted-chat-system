import ClientSocket from "./client-socket";
import * as readline from "readline";
import Encryption from "./encryption";

const encryption = new Encryption("1e5c552ee16059524d4a2af67576e9cee5aec906d1d8485a23e977edd923d766", "8674409fa3458e5bf72bab6cfd7c6177");
const clientSocket = new ClientSocket('http://localhost:3000', encryption);
clientSocket.connect();
clientSocket.handlePrivateMessage();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function askQuestion() {
    rl.question('Enter your name (or type "exit" to quit): ', (name) => {
        if (name.toLowerCase() === 'exit') {
            rl.close();
        } else {
            rl.question('Enter your message: ', (message) => {
                clientSocket.send(name, message);
                askQuestion();
            });
        }
    });
}

askQuestion();
