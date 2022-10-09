// src/routes/api/get.js

const response = require('../../response');
const { Fragment } = require('../../model/fragment');

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
/**
 * Get a list of fragments for the current user
 */
module.exports.fragments = (req, res) => {
  const data = req.body.toString('utf8');
  if (!Fragment.isSupportedType(req.headers['content-type'])) {
    throw 'Type is not supported.';
  }
  // use jwt to get the origin_jti which will be used as the ownerId
  // console.log('nice: ', JSON.stringify(req.headers['authorization']));
  let jwtJSON = parseJwt(req.headers['authorization']);
  let frag = new Fragment({ ownerId: jwtJSON.jti, type: 'text/plain' });
  frag.setData(data);
  frag.save();
  res.status(201).json(response.createSuccessResponse({ fragment: frag }));
};
