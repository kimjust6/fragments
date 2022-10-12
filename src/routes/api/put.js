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
    let key = sharedApiServices.parseJwt(req.headers['authorization']);
    logger.debug('put jwt jti: ');
    logger.debug(key);
    let frag = new Fragment({ id: req?.params?.id, ownerId: key, type: type });
    frag.loadMetaData().then((result) => {
      if (result) {
        frag.setData(data).then(() => {
          frag.save().then(() => {
            res.status(200).json(response.createSuccessResponse({ fragment: frag }));
          });
        });
      } else {
        return res.status(404).json(response.createErrorResponse(404, 'not found'));
      }
    });
  },
};
