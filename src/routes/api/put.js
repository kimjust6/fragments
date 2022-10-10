// src/routes/api/get.js

const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const sharedApiServices = require('./shared-api-services');
// https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library

/**
 * Get a list of fragments for the current user
 */
module.exports = {
  fragments: (req, res) => {
    let data;
    let type = req.headers['content-type'];
    if (!Fragment.isSupportedType(type)) {
      throw 'Type is not supported.';
    } else {
      let stringType = type.split(';')[1];
      if (stringType) {
        data = req.body.toString(stringType);
      } else {
        data = req.body.toString('utf8');
      }
    }
    // use jwt to get the origin_jti which will be used as the ownerId
    let jwtJSON = sharedApiServices.parseJwt(req.headers['authorization']);
    logger.debug('jwt jti: ');
    logger.debug(jwtJSON.jti);
    let frag = new Fragment({ ownerId: jwtJSON.jti, type: 'text/plain' });
    frag.setData(data);
    frag.save().then(() => {
      res.status(200).json(response.createSuccessResponse({ fragment: frag }));
    });
  },
};
