#!/bin/sh
echo "starting REST proxy..."
/usr/bin/kafka-rest-start /home/kafkan/config/kafka-rest.properties > /home/REST.log &
echo "starting node..."
cd /home/kafkan
node app.js