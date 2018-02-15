# CircleDisc

Zero dependency CI -> Discord webhook server.

## Usage

```js
const CircleDisc = require('circledisc');

const hook = new CircleDisc('url', 1337 /* can also be a http server */);

hook.startListening();

hook.on('ready', () => console.log("Ready!"));

```

## Supported Services

- [x] AppVeyor
- [x] CircleCI
- [x] Travis
- [x] Docker

## TODO

- [ ] Add Wercker support
- [ ] Fully support all states on AppVeyor builds
- [ ] Fully support all states on Travis builds
- [x] Add support for plugins
