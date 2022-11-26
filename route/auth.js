const express = require('express');
const router = express.Router();
router.get('/clientApi', async (req, res) => {
  res.send('This is Client api');
});
module.exports = router;
