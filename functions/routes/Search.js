const express = require('express');
const router = express.Router();
const request = require('request');
const query = require('../helpers/QueryParser');

router.use(express.json());

// -- routes --
// GET repository search results
router.get('/', (req, res) => {
  const access_token = req.session.access_token;
  if (!access_token) {
    return res.status(401).send('Unauthorized request');
  }

  const url = `https://api.github.com/search/repositories${query(req.url)}`;
  request.get(url, {
    headers: {
      'Authorization': `bearer ${access_token}`,
      'User-Agent': 'CrispiestHashbrown',
      'Accept': 'application/json'
    }
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const parsedBody = JSON.parse(body);
      return res.status(response.statusCode).send(parsedBody);
    } else {
      console.log(`${response.statusCode} response: Error accessing the Github API.`, error);
    }
  });
});

module.exports = router;