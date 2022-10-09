// src/routes/api/get.js

const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
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
    let jwtJSON = parseJwt(req.headers['authorization']);
    logger.debug('jwt jti: ');
    logger.debug(jwtJSON.jti);
    let frag = new Fragment({ ownerId: jwtJSON.jti, type: 'text/plain' });
    frag.setData(data);
    frag.save().then(() => {
      res.status(201).json(response.createSuccessResponse({ fragment: frag }));
    });
  },
};
