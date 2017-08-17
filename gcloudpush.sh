#!/bin/bash

gsutil rm -r gs://brentkirkland.com/*
gsutil cp -r build/* gs://brentkirkland.com
gsutil acl ch -ru AllUsers:R gs://brentkirkland.com/*
gsutil web set -m index.html gs://brentkirkland.com

echo done with gcloud push
