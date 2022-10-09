// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
// const { randomUUID } = require('crypto');
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

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    // initialize variables
    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.type = type;
    this.size = size;
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
    return await readFragmentData(_ownerId, _id);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} _ownerId user's hashed email
   * @param {string} _id fragment's id
   * @returns Promise
   */
  static delete(_ownerId, _id) {
    return deleteFragment(_ownerId, _id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  async save() {
    return await writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    return await readFragment(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} _data
   * @returns Promise
   */
  async setData(_data) {
    return await writeFragmentData(this.ownerId, this.id, _data);
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
    return this.isContentText(this.mimeType());
  }

  /**
   * @description gets a content type as a parameter and checks if it is a string
   * @param {string} _contentType string that is the content type
   * @returns {boolean} true if _contentType is text
   */
  isContentText(_contentType) {
    return _contentType.test('text/*');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    return ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'text'];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(_value) {
    _value = _value.toLowerCase();
    return (
      this.isContentText(_value) || _value === 'application/json' || this.formats().includes(_value)
    );
  }
}

module.exports.Fragment = Fragment;
