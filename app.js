const express = require('express')
const axios = require("axios")

const app = express()


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

app.get("/", async(req, res) => {

})

app.get("/callback", async(req, res) => {

})

app.post("/callback", async(req, res) => {

})


