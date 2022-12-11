// src/routes/api/get.js

const sharedApiServices = require('./shared-api-services');
const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = {
  fragments: (req, res) => {
    let data;
    let type = req.headers['content-type'];
    if (!Fragment.isSupportedType(type)) {
      res.status(415).json(response.createErrorResponse(415, 'unsupported media type'));
    } else {
      let stringType = sharedApiServices.getEncoding(type);
      data = req.body.toString(stringType);
    }
    logger.debug('post: req');
    logger.debug(req);
    // use jwt to get the origin_jti which will be used as the ownerId
    let key = sharedApiServices.parseJwt(req.headers['authorization']);
    logger.debug('jwt jti: ');
    logger.debug(key);
    let frag = new Fragment({ ownerId: key, type: type });
    frag.setData(data).then(() => {
      frag.save().then(() => {
        var httpPrefix = typeof req.connection.encrypted == 'undefined' ? 'http://' : 'https://';
        res.setHeader('Location', httpPrefix + req.get('host') + '/v1/fragments/' + frag.id);
        res.status(201).json(response.createSuccessResponse({ fragment: frag }));
      });
    });
  },
};
