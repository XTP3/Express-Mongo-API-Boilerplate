const express = require('express');
const router = express.Router();

//Asynchronously handle GET request to /test (/api/route/test)
router.get('/test', async (req, res) => {
    res.status(200).json({message: 'Hello'});
});

module.exports = router;