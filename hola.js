const fetch = require('node-fetch')
const query = require('readline-sync');

const s = async function () {
    const jsondata = await fetch("https://randomuser.me/api/1.2/?nat=usa");
    const data = await jsondata.json();
    return data.results[0].email;
}

const start = async function() {
    const t = await s();
    console.log(t);
  }


function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

start()