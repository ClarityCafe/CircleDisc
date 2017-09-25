# CircleDisc

CI -> Discord made easier.

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/AWTfak41YehZveZx8xMtTKdF/ClarityMoe/CircleDisc'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/AWTfak41YehZveZx8xMtTKdF/ClarityMoe/CircleDisc.svg' />
</a>

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
