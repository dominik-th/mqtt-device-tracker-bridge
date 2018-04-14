const Koa = require('koa');
const Router = require('koa-router');
const mqtt = require('mqtt');
const config = require('./config');
const app = new Koa();
const router = new Router();
const client = mqtt.connect(`mqtt://${config.mqtt.host}`);

router.get('/location/:device/:location', (ctx, next) => {
  client.publish(`location/${ctx.params.device}`, ctx.params.location);
});

router.get('/location/:device/:lat/:lng', (ctx, next) => {
  client.publish(`location/${ctx.params.device}`, JSON.stringify({
    latitude: ctx.params.lat,
    longitude: ctx.params.lng
  }));
});

app.use((ctx, next) => {
  if (ctx.query && ctx.query.secret === config.secret) {
    ctx.body = 'ok';
    next();
  } else {
    ctx.body = 'denied';
  }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

let port = config.port || 3000;
app.listen(port);
console.log(`Listening on ${port}`);
