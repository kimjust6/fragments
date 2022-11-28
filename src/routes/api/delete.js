// src/routes/api/get.js

const sharedApiServices = require('./shared-api-services');
const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = {
  fragmentsId: (req, res) => {
    // use jwt to get the origin_jti which will be used as the ownerId
    let key = sharedApiServices.parseJwt(req.headers['authorization']);
    logger.debug('delete jwt jti: ');
    logger.debug(key);

    Fragment.delete(key, req?.params?.id)
      .then(() => {
        res.status(200).json(response.createSuccessResponse());
      })
      .catch((error) => {
        logger.debug('fragmentId error: ');
        logger.debug(error);
        res.status(404).json(response.createErrorResponse(404, 'invalid request'));
      });
  },
};
