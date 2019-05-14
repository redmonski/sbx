const Endian = require('./../../Endian');
const Int32 = require('./../Core/Int32');

/**
 * Simple wrapper for an unsigned Int32 value (used for the n_operation value)
 */
class NOperation extends Int32 {

  /**
   * Constructor.
   *
   * @param {String} id
   */
  constructor(id = null) {
    super(id || 'nOperation', true, Endian.LITTLE_ENDIAN);
    this.description('Accounts n_operation value.');
  }

  /**
   * @inheritDoc AbstractType#typeInfo
   */
  /* istanbul ignore next */
  get typeInfo() {
    let info = super.typeInfo;

    info.name = 'NOperation';
    info.hierarchy.push(info.name);
    return info;
  }


  /**
   * Reads a value and returns a new PascalCoin AccountNumber instance.
   *
   * @param {BC} bc
   * @returns {PascalAccountName}
   */
  decodeFromBytes(bc) {
    return super.decodeFromBytes(bc);
  }

  /**
   *
   * Appends the given pascalcoin account number to the BC.
   *
   * @param {Number} value
   */
  encodeToBytes(value) {
    return super.encodeToBytes(value);
  }

  /**
   * @inheritDoc AbstractType#describe
   */
  /* istanbul ignore next */
  describe(value) {
    return super.describe(value);
  }
}

module.exports = NOperation;