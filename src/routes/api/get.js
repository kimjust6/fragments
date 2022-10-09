// src/routes/api/get.js

const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const response = require('../../response');

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

/**
 * Get a list of fragments for the current user
 */
module.exports.fragments = (req, res) => {
  logger.info('GET v1/fragments: ', req);

  logger.debug('query: ');
  logger.debug(req?.query);

  // call the byUser method with the expansion
  let jwtJSON = parseJwt(req.headers['authorization']);
  Fragment.byUser(jwtJSON.jti, req?.query.expanded === '1').then((result) => {
    res.status(200).json(
      response.createSuccessResponse({
        fragments: result,
      })
    );
  });
};
