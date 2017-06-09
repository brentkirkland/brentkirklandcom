// FLICK
// gcloud enpoint to handle light flick
// gcloud beta functions deploy flick --stage-bucket kirkydeskbucket --trigger-http

const PubSub = require('@google-cloud/pubsub');
const projectId = 'kirkydesk';

const pubsub = PubSub({
  projectId: projectId,
  retries: 5
});

function publishMessage (topicName, data) {

    const topic = pubsub.topic(topicName);
    return topic.publish(data)
      .then((results) => {
        const messageIds = results[0];
        console.log(`Message ${messageIds[0]} published.`);
        return messageIds;
      });
}

exports.flick = function putData (req, res) {

  console.log(req.body)

  let data = {
    message: req.body.message
  }

  publishMessage('kirkydesktopic', data)
  res.send('ok')

}
