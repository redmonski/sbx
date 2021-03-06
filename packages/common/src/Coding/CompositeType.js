/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const BC = require('./../BC');
const AbstractType = require('./AbstractType');

const P_SUBTYPES = Symbol('subtypes');
const P_SIZE_ENCODED = Symbol('size_encoded');

/**
 * A Type that itself is made up of multiple other (sub-)types.
 */
class CompositeType extends AbstractType {
  /**
   * Constructor
   */
  constructor(id) {
    super(id || 'composite_type');
    super.description('A type that itself is made up of multiple other types.');
    this[P_SUBTYPES] = [];
  }

  /**
   * Gets all subtypes.
   *
   * @returns {Array}
   */
  get subTypes() {
    return this[P_SUBTYPES];
  }

  /**
   * @inheritDoc AbstractType#encodedSize
   */
  get encodedSize() {
    return this[P_SIZE_ENCODED];
  }

  /**
   * Adds a new field (type) definition.
   *
   * @param {AbstractType} field
   */
  addSubType(field) {
    this[P_SUBTYPES].push(field);
    return this;
  }

  /**
   * Decodes the given bytes into an object.
   *
   * @param {BC|Buffer|Uint8Array|String} bc
   * @param {Object} options
   * @param {*} all
   * @return {*}
   */
  decodeFromBytes(bc, options = { toArray: false }, all = null) {
    if (this.canDecode === false) {
      throw new Error('This type cannot be decoded.');
    }
    const obj = {};
    let offset = 0;

    bc = BC.from(bc);

    this.subTypes.forEach((subType) => {
      obj[subType.id] = subType.decodeFromBytes(bc.slice(offset), options, obj);
      offset += subType.encodedSize;
    });
    this[P_SIZE_ENCODED] = offset;

    return options.toArray ? Object.values(obj) : obj;
  }

  /**
   * Encodes the given object to a list of bytes.
   *
   * @param {Object|Array|*} objOrArray
   * @returns {BC}
   */
  encodeToBytes(objOrArray) {
    let bc = BC.empty();

    this.subTypes.forEach((subType, idx) => {
      let subTypeValue;

      if (subType.hasFixedValue) {
        subTypeValue = subType.fixedValue;
      } else {
        subTypeValue = Array.isArray(objOrArray) ? objOrArray[idx] : objOrArray[subType.id];
      }

      // we will use the first available
      bc = bc.append(subType.encodeToBytes(subTypeValue, objOrArray));
    });

    this[P_SIZE_ENCODED] = bc.length;
    return bc;
  }
}

module.exports = CompositeType;
