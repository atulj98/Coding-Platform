const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];

rl.on('line', (input) => {
    lines.push(input);
});

rl.on('close', () => {
    // Your code here
    // Access input lines using lines[0], lines[1], etc.
    
    // Example: 
    // console.log(lines[0]);
});
