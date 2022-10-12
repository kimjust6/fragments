module.exports = {
  parseJwt(token) {
    if (token.split('Basic ')[1]) {
      return token.split('Basic ')[1];
    } else {
      return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).jti;
    }
  },
  /**
   *
   * @param {*} stringType
   */
  getEncoding(type) {
    let defaultCharSet = 'utf8';
    let charSetType = type.split(';')[1];
    charSetType = type.split('=')[1];
    if (!charSetType || charSetType === 'utf-8') {
      charSetType = defaultCharSet;
    }

    return charSetType;
  },
};
