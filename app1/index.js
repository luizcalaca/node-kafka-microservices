const express = require('express')
const kafka = require('kafka-node')
const app = express()
app.use(express.json())

const isRunning = () => {
    const client = new kafka.KafkaClient({kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS})
    const producer = new kafka.Producer(client)
    
    producer.on('ready', () => {
        app.post('/', async (req, res) => {
            producer.send([{topic: process.env.KAFKA_TOPIC, messages: JSON.stringify(req.body)}], async (err, data) => {
                if(err) res.send(err)
                else {
                    res.send(req.body)
                } 
            })
        })
    })
}
setTimeout(isRunning, 1000)

app.listen(process.env.PORT)