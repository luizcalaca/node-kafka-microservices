const express = require('express')
const kafka = require('kafka-node')
const { default: mongoose } = require('mongoose')
const app = express()

mongoose.connect(process.env.MONGO_URL)
const User = new mongoose.model('user',{
    name: String,
    email: String,
    password: String
})

app.use(express.json())

const client = new kafka.KafkaClient({kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS})
const consumer = new kafka.Consumer(client, [{topic: process.env.KAFKA_TOPIC}], {
    autoCommit: false
})

consumer.on('message', async(message) => {
    const user = new User(JSON.parse(message.value))
    await user.save()
    
})

consumer.on('error', (err) => {
    console.log(err)
})

app.listen(process.env.PORT)