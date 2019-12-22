import sha3 from 'crypto-js/sha3';

const __encryptedMessages = {};

export default {

  /**
   * @name        encrypt
   * @namespace     sugar.js.crypt.sha3
   * @type          Function
   *
   * Encrypt
   *
   * @param       {String}      message         The message to encrypt
   * @return      {String}                      The encrypted string
   *
   * @author 		Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
   */
  encrypt: function(message) {
    const string = sha3(message).toString();
    __encryptedMessages[string] = message;
    return string;
  },

  /**
   * @name        decrypt
   * @namespace     sugar.js.crypt.sha3
   * @type        Function
   *
   * Decrypt
   *
   * @param       {String}        message         The message to decrypt
   * @return      {String}                        The decrypted message
   *
   * @author 		Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
   */
  decrypt: function(message) {
    if ( ! __encryptedMessages[message]) {
      console.warn(`The message "${message}" cannot be decrypted...`);
      return;
    }
    const string = __encryptedMessages[message];
    delete __encryptedMessages[message];
    return string;
  }

};
