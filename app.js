require("dotenv").config();
const util = require("util");

const express = require("express");

const axios = require("axios");
const Discord = require("discord.js");
const cron = require("node-cron");

const client = new Discord.Client();

const app = express();

// convert express app to http app to use socket.io
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.json());

// https://www.w3.org/TR/websub/#high-level-protocol-flow

/* 
- Definitions that we will need

Subscriber: Katarina & everkers
Publisher: Twitch
Hub: Twitch Api

1 - We make a POST request to the hub that containt the following : https://dev.twitch.tv/docs/api/webhooks-reference
2 - When we make the first request, the hub will check if the data we send are real and to do that 
    it send a GET request to the subscriber's callback URL that we sended in the subscription request that we made in 
    the beginning that contain the following (query / body depend on publicher) 
    - hub.mode
    - hub.topic
    - hub.challenge (we are interest on this one)
    - hub.lease_seconds
3 - So after We get the hub.challenge from the hub we need to send it as text plain as responce to the hub request
4 - Now we are subscribed to the publicher with the time that we send in the first request which is (hub.lease_seconds)
    According to twitch the default is 0 which mean it become just an normal webhook
    But when we increase it we start getting event if someone start streaming or anything depend on what we choose
    in the first request (Max on twitch 864000s = 10 Days) 
    So at the end (hub.lease_seconds) should be specified to a value greater than 0 otherwise subscriptions will expire before
     any useful notifications can be sent.

5 - So now after we subscibed successfully, if any event that happen in the publicher platform it will be send 
    as a POST request from the hub to our callback URL containing the data depend on the topic we choose

    HAPPY UNDERSTANDING NOW 

    "I AM AN ARTIST WITH A SWORD, IN MORE WAYS THAN ONE"
    FIORA

*/

/**
 *
 * CRON FOR LOLARABIA
 */

cron.schedule("0 0 * * 1", async () => {
  const data = {
    "hub.mode": "subscribe",
    "hub.topic": `https://api.twitch.tv/helix/streams?user_id=437144416`,
    "hub.lease_seconds": 604800, // 7days == 604800
    "hub.callback": "https://grevious-wounds.herokuapp.com/callback",
  };
  //console.log(process.env.ACCESS_TOKEN);

  try {
    const result = await axios.post(
      "https://api.twitch.tv/helix/webhooks/hub",
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Client-Id": process.env.CLIENT_ID,
        },
      }
    );
    console.log("ne7ila");
  } catch (e) {
    console.log(e);
    // res.json({
    //   error: e.message,
    //   //errorRequest: e.response.data,
    // });
  }
});

/* 

  subscibe section

*/

app.get("/", async (req, res) => {
  const data = {
    "hub.mode": "subscribe",
    "hub.topic": `https://api.twitch.tv/helix/streams?user_id=${req.query.userId}`,
    "hub.lease_seconds": 604800, // 7days == 604800
    "hub.callback": "https://grevious-wounds.herokuapp.com/callback",
  };
  //console.log(process.env.ACCESS_TOKEN);

  try {
    const result = await axios.post(
      "https://api.twitch.tv/helix/webhooks/hub",
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Client-Id": process.env.CLIENT_ID,
        },
      }
    );
    res.status(200).send("ne7ila");
  } catch (e) {
    console.log(e);
    res.json({
      error: e.message,
      //errorRequest: e.response.data,
    });
  }
});

/* 

  unsubscibe section

*/

app.get("/unsubscribe", async (req, res) => {
  const data = {
    "hub.mode": "unsubscribe",
    "hub.topic": `https://api.twitch.tv/helix/streams?user_id=${req.query.userId}`,
    "hub.lease_seconds": 259200, // 7days == 604800
    "hub.callback": "https://grevious-wounds.herokuapp.com/callback",
  };
  //console.log(process.env.ACCESS_TOKEN);

  try {
    const result = await axios.post(
      "https://api.twitch.tv/helix/webhooks/hub",
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Client-Id": process.env.CLIENT_ID,
        },
      }
    );
    res.status(200).send("ne7ila");
  } catch (e) {
    console.log(e);
    res.json({
      error: e.message,
      //errorRequest: e.response.data,
    });
  }
});

/* 

  callback section

*/

app.get("/callback", async (req, res) => {
  const body = req.query;
  //console.log(body["hub.challenge"]);

  if (body["hub.challenge"]) {
    res.status(200).send(body["hub.challenge"]);
  } else {
    console.log(body["hub.reason"]);
    res.status(400).json(body);
  }
});

client.on("ready", () => {
  client.user.setPresence({
    game: {
      name: "Blood for NEXUS",
    },
  });
  app.post("/callback", async (req, res) => {
    const body = req.body;
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);

    const msg = `<@232909121639153665> <@490663251953188865> LOL ARABIA IS STREAMING U BITCHES QJKSJQKJQKj`.concat(
      "\n",
      "```json\n" + util.inspect(body, false, null) + "```"
    );
    channel.send(msg);
    if (body.data == [] || body.data.length == 0) {
      // here we know that the stream ended
      io.emit("STREAM_END");
    } else {
      // we know that stream start or change title or any event happen
      io.emit("STREAM_START", body.data);
    }

    res.status(200).send("Ok");
  });
});

client.login(process.env.DISCORD_TOKEN);

http.listen(process.env.PORT || 5000, () => {
  console.log(`UwU....${process.env.PORT || 5000}`);
});
