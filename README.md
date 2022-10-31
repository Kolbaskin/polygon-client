# Polygon client

## Setup

```
npm install polygon-client
```

## Getting started

```javascript
const Polygon = require("polygon-client");

const client = new Polygon({
  url: "<parser server address>",
  accessToken: "<your access token>",
  secret: "<your secret key>"
});

(async function () {
  const deviceTypes = await client.getDeviceTypes();

  console.log("deviceTypes:", deviceTypes);

  const device = await client.createDevice({
    device_id: "100000000000007",
    imei: "100000000000007",
    description: "Navitelecom test",
    device_type: "Navitelecom",
    entity_type: "car"
  });

  console.log("device:", device);

  const deviceExists = await client.getDevice("100000000000006", "Navitelecom");

  console.log("deviceExists:", deviceExists);

  await client.connect();
  client.onData((data) => {
    console.log(data); // sensor data in real time
  });
})();
```
