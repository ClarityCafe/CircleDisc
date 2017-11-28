# CircleDisc

CI -> Discord made easier.


## Usage

```js
const CircleDisc = require('circledisc');

const hook = new CircleDisc('id', 'token', 8080);

// OR

const hook = new CircleDisc(url, 8080) // you can replace the port with a HTTP server here too

hook.on("listening", () => console.log("Listening!"));

```


``url`` Webhook URL

``port/server`` the port/http server to use

## Supported CIs

- [x] AppVeyor
- [x] CircleCI
- [x] Travis

## TODO

- [ ] Add Wrecker support
- [ ] Fully support all states on AppVeyor builds
- [ ] Fully support all states on Travis builds
- [ ] Add support for plugins
