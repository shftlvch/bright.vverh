const express = require('express')
const cors = require('cors')

const router = express.Router()
const {MainApi} = require('../api')

router.get('/', async function (req, res, next) {
    const db = new MainApi()
    const data = await db.getMain()
    console.log(data);
    res.json({data, status: 'ok'})
});

router.get('/save', async function (req, res, next) {
    const db = new MainApi()
    const data = await db.getMain()
    console.log('hello');
    res.json({data, status: 'ok'})
});

router.get('/get/:hash', async function (req, res, next) {
    const db = new MainApi();
    const data = await db.getEntry(req.params.hash);
    console.log('/get/:hash');
    console.log(data);
    res.json({data, status: 'ok'});
});

router.options('/process', cors()); // enable pre-flight request for DELETE request
router.post('/process', cors(), async function (req, res, next) {
    const db = new MainApi();


    const object = await db.convertPic(req.body);
    const data = {object: object.result, vibrant: object.vibrant};
    res.json({data, status: 'ok'});
});


module.exports = router

