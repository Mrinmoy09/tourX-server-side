const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gdsos.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('tourismService');
        const serviceCollections = database.collection('services');
        const orderCollections = database.collection('orders');

        // get api
        app.get('/services' , async(req,res)=>{
            const cursor = serviceCollections.find({})
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await serviceCollections.findOne(query);
            res.json(result);
        })

        // post method
        app.post('/addservice',async(req,res)=>{
            const service = req.body;
            const result = await serviceCollections.insertOne(service);
            res.json(result);
        })
        app.post('/orders',async(req,res)=>{
            const service = req.body;
            const result = await orderCollections.insertOne(service);
            console.log(result);
            res.json(result);
        })

        app.get('/allBookings',async(req,res)=>{
            const cursor = orderCollections.find({})
            const bookings = await cursor.toArray();
            res.send(bookings);
        })

        app.get('/myBookings/:email',async(req,res)=>{
           console.log(req.params.email);
           const result = await orderCollections.find({email:req.params.email}).toArray();
           res.send(result);
        })

        // delete booking
        app.delete('/delete/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await orderCollections.deleteOne(query);
            res.json(result);
        })

    }
    finally{

    }
}

run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send("tourx")
})

app.listen(port,(req,res)=>{
    console.log("running on port" , port);
})