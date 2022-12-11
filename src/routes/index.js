// src/routes/index.js
const { hostname } = require('os');
// const { createErrorResponse, createSuccessResponse } = require('../../src/response');
const { createSuccessResponse } = require('../../src/response');
const express = require('express');

// version and author from package.json
const { version, author } = require('../../package.json');
// Our authorization middleware
const { authenticate } = require('../authentication');

// Create a router that we can use to mount our API
const router = express.Router();

// /**
//  * Expose all of our API routes on /v1/* to include an API version.
//  */
// router.use(`/v1`, require('./api'));

/**
 * Expose all of our API routes on /v1/* to include an API version.
 * Protect them all so you have to be authenticated in order to access.
 */
router.use(`/v1`, authenticate(), require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */

router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json(
    createSuccessResponse({
      author: author,
      githubUrl: 'https://github.com/kimjust6/fragments',
      version,
      // Include the hostname in the response
      hostname: hostname(),
    })
  );
});

module.exports = router;
