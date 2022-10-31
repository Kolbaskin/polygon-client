const axios = require("axios");
const ws = require("websocket");

module.exports = class PolygonClient {
  constructor(opt) {
    this.config = opt;
  }

  async getDeviceTypes() {
    const res = await this.callApi("entity-service", "getDeviceTypes", {});
    return res.types;
  }

  async createDevice(data) {
    const res = await this.callApi("entity-service", "create", data);
    return res;
  }

  async getDevice(device_id, device_type) {
    const res = await this.callApi("entity-service", "getDevice", {
      device_id,
      device_type
    });
    return res.device;
  }

  async removeDevice(id) {
    return {
      success: true
    };
  }

  connect() {
    return new Promise((resp) => {
      var WebSocketClient = ws.client;
      var client = new WebSocketClient();
      client.on("connect", (conn) => {
        this.wsConnect = conn;
        conn.on("close", () => {
          console.log("closed");
          delete this;
        });
        resp();
      });
      client.connect(this.config.url, null, "*", {
        authorization: `bearer${this.config.accessToken}`
      });
    });
  }

  async onData(p1, p2) {
    let cb, devices;
    if (!!p2) {
      devices = p1;
      cb = p2;
    } else {
      cb = p1;
    }
    this.wsConnect.on("message", (message) => {
      const res = JSON.parse(message.utf8Data);
      if (res && (!devices || devices.includes(res.id))) cb(res);
    });
  }

  async callApi(service, method, data) {
    const res = await axios.post(
      this.config.url,
      {
        header: {
          service,
          method,
          id: 1,
          version: "0.1.1"
        },
        data
      },
      {
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
          "content-type": "application/json"
        }
      }
    );
    if (res && res.data && res.data.header && res.data.header.status == "OK")
      return res.data.data;
    console.log(JSON.stringify(res.data.error, null, 4));
  }
};
