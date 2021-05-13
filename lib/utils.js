
/**
 * Convert 'satoshi' to bitcoin value
 * 
 * @param {number} value 
 * @param {number}
 */
const satoshiToBTC = (value) => value * 0.00000001;

module.exports = {
  satoshiToBTC,
}
