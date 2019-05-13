const AbstractInt = require('./AbstractInt');
const BC = require('./../../BC');
const Endian = require('./../../Endian');
const BN = require('bn.js');

function validate64Bit(isUnsigned, value) {
  if (isUnsigned) {
    if (value.isNeg()) {
      throw new Error('64bit value is negative. Only signed allowed.');
    } else if (value.gt(new BN('18446744073709551615'))) {
      throw new Error('Invalid unsigned 64 bit value.');
    }
  } else if (!isUnsigned) {
    if (value.gt(new BN('9223372036854775807')) || value.lt(new BN('-9223372036854775808'))) {
      throw new Error('Invalid signed 64 bit value.');
    }
  }

  return value;
}

/**
 * Field type for 64bit int values using BN.js.
 */
class Int64 extends AbstractInt {

  /**
   * Constructor
   *
   * @param {String} id
   * @param {Boolean} unsigned
   * @param {String} endian
   */
  constructor(id, unsigned = true, endian = Endian.LITTLE_ENDIAN) {
    super(id || 'int64', unsigned, endian);
    this.description('8byte 64bit int value');
  }

  /**
   * @inheritDoc AbstractType#typeInfo
   */
  /* istanbul ignore next */
  get typeInfo() {
    let info = super.typeInfo;

    info.name = 'Int64';
    info.hierarchy.push(info.name);

    return info;
  }

  /**
   * @inheritDoc AbstractType#encodedSize
   */
  get encodedSize() {
    return 8;
  }

  /**
   * Reads the pascal currency value from the given BC.
   *
   * @param {BC} bc
   * @returns {BN}
   */
  decodeFromBytes(bc) {
    let value = new BN(bc.buffer, 10, this.endian.toLowerCase());

    if (!this.unsigned) {
      value = value.fromTwos(64);
    }

    return validate64Bit(this.unsigned, value);
  }

  /**
   * Appends the given currency value to the given BC.
   *
   * @param {BN} value
   */
  encodeToBytes(value) {
    value = validate64Bit(this.unsigned, value);
    if (!this.unsigned) {
      value = value.toTwos(64);
    }
    return BC.from(value.toBuffer(this.endian.toLowerCase(), this.encodedSize));
  }

  /**
   * @inheritDoc AbstractType#describe
   */
  /* istanbul ignore next */
  describe(value) {
    let description = super.describe(value);

    description.encodedSize = this.encodedSize;

    if (arguments.length > 0) {
      description.decoded = value;
      description.decodedSimple = value.toString(10, this.encodedSize);
      description.encoded = this.encodeToBytes(value).toHex();
    }

    return description;
  }
}

module.exports = Int64;
