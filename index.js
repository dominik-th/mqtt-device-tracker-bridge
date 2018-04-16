const Koa = require('koa');
const Router = require('koa-router');
const mqtt = require('mqtt');
const config = require('./config');

let app = new Koa();
let router = new Router();

let mqttHost = config.mqtt.host || 'localhost';
let client = mqtt.connect(`mqtt://${mqttHost}`);

router.get('/location/:device/:location', (ctx, next) => {
  let {
    device,
    location
  } = ctx.params;
  if (!config.allowedDevices || config.allowedDevices.indexOf(device) > -1) {
    client.publish(`location/${device}`, location);
  }
});

router.get('/location/:device/:lat/:lng', (ctx, next) => {
  let {
    device,
    lat,
    lng
  } = ctx.params;
  if (!config.allowedDevices || config.allowedDevices.indexOf(device) > -1) {
    client.publish(`location/${ctx.params.device}`, JSON.stringify({
      latitude: lat,
      longitude: lng
    }));
  }
});

app.use((ctx, next) => {
  if (!config.secret || ctx.query && ctx.query.secret === config.secret) {
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
