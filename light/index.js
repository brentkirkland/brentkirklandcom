const fetch = require('node-fetch');
var gpio = require('rpi-gpio');

var current_status = false;

setInterval(() => {
   checkStatus();
}, 1000)

function checkStatus() {
   fetch('https://us-central1-kirkydesk.cloudfunctions.net/get')
      .then(res => res.json())
      .then(json => flickLight(json[0][0].status))
}

function flickLight(status) {

   if (current_status != status) {
      current_status = status;
      gpio.setup(18, gpio.DIR_OUT, (err) => {
         if (err) throw err;
         gpio.write(18, status, (err) => {
            if (err) throw err;
               console.log('Light switch to: ', status, 'at ', Date.now());                 });
      });
   }
}
