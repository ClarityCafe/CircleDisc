const CircleDisc = require('../');

const client = new CircleDisc(process.env.URL, process.env.PORT);

client.startListening();

client.once('ready', () => console.log('Ready!'));

