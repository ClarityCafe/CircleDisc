# CircleDisc

CI -> Discord made easier.

## Usage

```js
const CircleDisc = require('circledisc');

const hook = new CircleDisc('id', 'token', 8080);

// OR

const hook = new CircleDisc('webhook url', 8080) // you can replace the port with a HTTP server here too

hook.on("listening", () => console.log("Listening!"));

```

``id`` Webhook ID

``token`` Webhook token

``port/server`` the port/http server to use


## Supported CIs

- [x] AppVeyor
- [x] CircleCI
- [ ] Travis