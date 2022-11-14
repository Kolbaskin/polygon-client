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
  const vendors = await client.getVendors();

  console.log("vendors:", vendors);

  /*
  vendors: [
    {
      id: '2c6d53ef-7056-44ff-a4bf-0c68717eb31c',
      name: 'Navitelecom',
      address: '-',
      country: 'RU'
    },
    {
      id: 'cca8c7ca-2273-454e-bcba-884e426367a4',
      name: 'Teltonika',
      address: '-',
      country: 'LT'
    }
  ]
  */

  const models = await client.getVendorModels(vendors[0].id);

  console.log("models:", models);

  /*
  [
    {
      id: 'ae99c3a3-0595-4537-8f8a-94a8701c3078',
      model_name: 'Navitelecom',
      model_number: '1',
      manufacture_date: '2022-11-13T21:00:00.000Z',
      protocols: [ 'Flex' ]
    }
  ]
  */

  const device = await client.createDevice({
    vendor_id: "2c6d53ef-7056-44ff-a4bf-0c68717eb31c",
    model_id: "ae99c3a3-0595-4537-8f8a-94a8701c3078",
    device_id: "100000000000007",
    imei: "100000000000007",
    description: "Navitelecom test",
    protocol: "Flex",
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
