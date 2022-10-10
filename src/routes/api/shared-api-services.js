module.exports = {
  parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
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
