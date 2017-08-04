// gcloud beta functions deploy get --stage-bucket kirkydeskbucket --trigger-http

const Datastore = require('@google-cloud/datastore');
const projectId = 'kirkydesk';
const datastore = Datastore({
  projectId: projectId
});

exports.get = function getDevices (req, res) {

  const query = datastore.createQuery('light_status')
  .order('timestamp', {
    descending: true
  })
  .limit(1);

  datastore.runQuery(query)

  .then((results) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(results)
  });

}
