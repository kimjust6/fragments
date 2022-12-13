// node.js, "classic" way:
// enable everything
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
});

// src/routes/api/get.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const response = require('../../response');
const sharedApiServices = require('./shared-api-services');

/**
 * Get a list of fragments for the current user
 */
module.exports = {
  fragments: (req, res) => {
    logger.info('GET v1/fragments: ', req);

    logger.debug('query: ');
    logger.debug(req?.query);

    // call the byUser method with the expansion
    let key = sharedApiServices.parseJwt(req?.headers?.authorization);

    Fragment.byUser(key, req?.query?.expanded === '1').then((result) => {
      res.status(200).json(
        response.createSuccessResponse({
          fragments: result,
        })
      );
    });
  },

  fragmentId: (req, res) => {
    logger.info('GET v1/fragments/:id: ', req);
    logger.debug('params: ');
    logger.debug(req?.params);

    //  check if there are extensions and we need to do conversions
    let idSplit = req?.params?.id?.split('.');
    logger.debug('arrSplit');
    logger.debug(idSplit);

    // call the byUser method with the expansion
    let key = sharedApiServices.parseJwt(req.headers['authorization']);
    var myFrag = new Fragment({ id: idSplit[0], ownerId: key, type: 'text/plain' });
    myFrag
      .getData()
      .then((result) => {
        if (result.length) {
          // check if we need to do conversion
          if (idSplit.length > 1) {
            // check if it is an image or text
            if (myFrag.isText) {
              logger.debug('isText');
              if (idSplit[1] == 'md') {
                // handle md
                logger.debug('md');
                logger.debug(result);
                res.setHeader('content-type', 'text/md');
              } else if (idSplit[1] == 'html') {
                // handle html
                result = md.render(result);
                logger.debug('html');
                logger.debug(result);
                res.setHeader('content-type', 'text/md');
              } else {
                res.setHeader('content-type', 'text/plain');
              }
            }
            // probably image
            else {
              logger.debug('is image');
              // if (idSplit[1] == 'image/jpg' || idSplit[1] == 'image/jpeg') {
              //   res.setHeader('content-type', 'text/jpg');
              // } else if (idSplit[1] == 'image/png') {
              //   res.setHeader('content-type', 'text/png');
              // } else if (idSplit[1] == 'image/gif') {
              //   res.setHeader('content-type', 'text/gif');
              // } else if (idSplit[1] == 'image/webp') {
              //   res.setHeader('content-type', 'text/webp');
              // }
            }
          }
          // check for content-types

          res.status(200).send(result);
        } else {
          res.status(404).json(response.createErrorResponse(404, 'invalid request'));
        }
      })
      .catch((error) => {
        logger.debug('fragmentId error: ');
        logger.debug(error);
        res.status(404).json(response.createErrorResponse(404, 'invalid request'));
      });
  },
  fragmentIdInfo: (req, res) => {
    logger.info('GET v1/fragments/:id/info: ', req);
    logger.debug('params: ');
    logger.debug(req?.params);

    // call the byUser method with the expansion
    let key = sharedApiServices.parseJwt(req.headers['authorization']);
    Fragment.byId(key, req?.params?.id)
      .then((result) => {
        res.status(200).json(
          response.createSuccessResponse({
            fragments: result,
          })
        );
      })
      .catch((error) => {
        logger.debug('fragmentId error: ');
        logger.debug(error);
        res.status(404).json(response.createErrorResponse(404, 'invalid request'));
      });
  },
};
