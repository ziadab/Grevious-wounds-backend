const io = require("socket.io-client");
const open = require("open");

const socket = io("https://grevious-wounds.herokuapp.com/");

console.log("listing to lolarabia...");

/**
 *
 * Events
 *
 * STREAM_START => When stream start and I got with it the data object
 * STREAM_END => When stream go off
 *
 *
 */

socket.on("STREAM_START", async (data) => {
  console.log(data);
  console.log("Stream start");
  await open("https://www.twitch.tv/lolarabia");
});
