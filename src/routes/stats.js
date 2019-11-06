const express = require('express');
const router = express.Router();

router.get('/stats', (req, res) => {
    res.render('contents/stats');
});

module.exports = router;