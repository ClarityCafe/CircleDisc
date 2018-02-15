const CircleDisc = require('../');

const client = new CircleDisc('url', process.env.PORT);

client.startListening();

client.once('ready', () => console.log('Ready!'));

