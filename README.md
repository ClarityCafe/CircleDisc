# CircleDisc

CI -> Discord made easier.


## Usage

```js
const CircleDisc = require('circledisc');

const hook = new CircleDisc('url', 1337 /* can also be a http server */);

hook.on('ready', () => console.log("Ready!"));

```

## Supported Services

- [x] AppVeyor
- [x] CircleCI
- [x] Travis

## TODO

- [ ] Add Wercker support
- [ ] Fully support all states on AppVeyor builds
- [ ] Fully support all states on Travis builds
- [x] Add support for plugins
