// FLICK
// gcloud enpoint to handle light flick
// gcloud beta functions deploy flick --stage-bucket kirkydeskbucket --trigger-http

const Datastore = require('@google-cloud/datastore');
const projectId = 'kirkydesk';
const ignores = require('./ignores')
const twilio = require('twilio');
var client = new twilio(ignores.accountSid, ignores.authToken);
const datastore = Datastore({
  projectId: projectId
});

function sendMessage(body) {

  client.messages.create({
      to: ignores.admin_num,
      from: ignores.twilio_num,
      body: body
    })
    .then((message) => console.log(message));
}

exports.flick = function putData(req, res) {

  console.log(req.body)
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const query = datastore.createQuery('light_status')
    .order('timestamp', {
      descending: true
    })
    .limit(1);

  // TODO:// Check timestamp for timeout conditions

  datastore.runQuery(query)

    .then((results) => {

      let data = {
        message: req.body.message
      }

      var current_time = (new Date).getTime()

      var kind = 'light_status'
      var name = current_time
      var taskKey = datastore.key([kind, name]);

      var task = {
        key: taskKey,
        data: {
          message: req.body.message,
          status: !results[0][0].status,
          timestamp: current_time,
          ip: ip
        }
      };

      datastore.save(task)
        .then(() => {
          console.log(`Saved ${task.key.name}`);
          sendMessage('From brentkirkland.com: ' + req.body.message)
          // TODO: better error response
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.send('ok')
        });

    });

}
