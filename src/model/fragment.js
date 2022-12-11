// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');
const logger = require('../logger');

class Fragment {
  constructor({ id, ownerId, type, size = 0 }) {
    // initialize variables
    if (ownerId == null) {
      throw new Error('ownerId cannot be null.');
    } else if (type == null) {
      throw new Error('type cannot be null.');
    } else if (typeof size == 'string' || isNaN(size)) {
      throw new Error('size is not a number.');
    } else if (size < 0) {
      throw new Error('size cannot be negative.');
    } else if (!Fragment.isSupportedType(type)) {
      throw new Error('type is not supported.');
    } else {
      if (id === null || typeof id === 'undefined') {
        this.id = randomUUID();
      } else {
        this.id = id;
      }

      this.ownerId = ownerId;
      this.created = new Date();
      this.updated = this.created;
      this.type = type;
      this.size = size;
    }
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} _ownerId user's hashed email
   * @param {boolean} _expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(_ownerId, _expand = false) {
    return await listFragments(_ownerId, _expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} _ownerId user's hashed email
   * @param {string} _id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(_ownerId, _id) {
    const returnVal = await readFragment(_ownerId, _id);
    if (!returnVal) {
      throw new Error('Fragment id does not exist.');
    } else {
      return returnVal;
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} _ownerId user's hashed email
   * @param {string} _id fragment's id
   * @returns Promise
   */
  static async delete(_ownerId, _id) {
    logger.debug('1) delete: ', _ownerId, _id);
    const returnVal = await deleteFragment(_ownerId, _id);
    if (!returnVal) {
      throw new Error('Could not delete fragment.');
    } else {
      return returnVal;
    }
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  async save() {
    this.updated = new Date();
    return await writeFragment(this);
  }

  async loadMetaData() {
    let myData = await readFragment(this.ownerId, this.id);
    if (typeof myData !== 'undefined') {
      logger.debug('myData inside loadMetaData: ');
      logger.debug(myData);
      this.size = myData.size;
      this.created = myData.created;
      this.updated = myData.updated;
      this.type = myData.type;
      this.size = myData.size;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    return await readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} _data
   * @returns Promise
   */
  async setData(_data) {
    if (_data) {
      this.updated = new Date();
      // if (typeof _data == 'string') {
      this.size = _data.length;
      // } else {
      //   this.size = JSON.stringify(_data).length;
      // }
      logger.debug();
      logger.debug('saving data3: ');
      logger.debug(JSON.stringify(_data));

      return await writeFragmentData(this.ownerId, this.id, _data);
    } else {
      throw new Error('Please enter valid data.');
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return Fragment.isContentText(this.type);
  }

  /**
   * @description gets a content type as a parameter and checks if it is a string
   * @param {string} _contentType string that is the content type
   * @returns {boolean} true if _contentType is text
   */
  static isContentText(_contentType) {
    return /text*/.test(_contentType);
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    // return this.getFormats;
    return [this.mimeType];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(_value) {
    _value = _value.toLowerCase();
    _value = _value.split(';')[0];
    logger.debug('value: ');
    logger.debug(_value);
    return (
      this.isContentText(_value) ||
      [
        'application/json',
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/webp',
        'image/gif',
      ].includes(_value)
    );
  }
}

module.exports.Fragment = Fragment;
