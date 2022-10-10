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
    // use jwt to get the origin_jti which will be used as the ownerId
    let jwtJSON = sharedApiServices.parseJwt(req.headers['authorization']);
    logger.debug('jwt jti: ');
    logger.debug(jwtJSON.jti);
    let frag = new Fragment({ id: req?.params?.id, ownerId: jwtJSON.jti, type: 'text/plain' });
    frag.setData(data);
    frag.save().then(() => {
      res.status(200).json(response.createSuccessResponse({ fragment: frag }));
    });
  },
};
