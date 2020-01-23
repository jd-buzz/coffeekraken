import __ensureExist from '@coffeekraken/sugar/js/object/ensureExist';

/**
 * @name                                  log
 * @namespace                             squid.js.log
 * @type                                  Function
 *
 * Log a message using the transports log system.
 *
 * @param           {String}              message                   The message to log
 * @param           {String}              [type="info"]             The type of log. Can be "error", "warn", "info", "http", "verbose", "debug", "silly"
 * @param           {Array}               [transports=null]         The transports that you want to use for this log process. If null, use all the transports configured in the squid config for the type of log passed
 * @return          {Promise}                                       A promise resolved once the log process is finished
 *
 * @example           js
 * Squid.log('Hello world', 'error').then(() => {
 *    // do something if needed...
 * });
 *
 * @author 			Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
 */
export default (message, type = 'info', transports = null) => {
  return new Promise((resolve, reject) => {

    __ensureExist('window.Squid._log');

    Promise.all([
      import('@coffeekraken/sugar/js/log/log'),
      import('@coffeekraken/sugar/js/log/isTransportRegistered'),
      import('@coffeekraken/sugar/js/log/getRegisteredTransports'),
      import('@coffeekraken/sugar/js/log/registerTransport')
    ]).then((modules) => {

      const __log = modules[0],
            __isTransportRegistered = modules[1],
            __getRegisteredTransports = modules[2],
            __registerTransport = modules[3];

      // get the transports needed for this type
      const configTransports = Squid.config.log.frontend.transportsByType[type] ? Squid.config.log.frontend.transportsByType[type].split(' ') : [];
      let transp = transports ? transports : configTransports;

      if ( ! Squid._log.squidTransports) {
        Squid._log.squidTransports = require.context('./transports', true, /\.js$/, 'lazy');
        Squid._log.appTransports = require.context(`@app/logTransports`, true, /\.js$/, 'lazy');
        Squid._log.sugarTransports = require.context(`@coffeekraken/sugar/js/log/transports`, true, /\.js$/, 'lazy');
      }

      const transportsImportPromises = [];
      transp.forEach(t => {
        if (Squid._log.squidTransports.keys().indexOf(`./${t}.js`) !== -1) {
          transportsImportPromises.push(Squid._log.squidTransports(`./${t}.js`).then(m => {
            if ( ! __isTransportRegistered.default(t)) __registerTransport.default(t, m.default || m);
          }));
        } else if (Squid._log.appTransports.keys().indexOf(`./${t}.js`) !== -1) {
          transportsImportPromises.push(Squid._log.appTransports(`./${t}.js`).then(m => {
            if ( ! __isTransportRegistered.default(t)) __registerTransport.default(t, m.default || m);
          }));
        } else if (Squid._log.sugarTransports.keys().indexOf(`./${t}.js`) !== -1) {
          transportsImportPromises.push(Squid._log.sugarTransports(`./${t}.js`).then(m => {
            if ( ! __isTransportRegistered.default(t)) __registerTransport.default(t, m.default || m);
          }));
        }
      });

      Promise.all(transportsImportPromises).then(() => {

        __log.default(message, type, transp).then(() => {
          resolve();
        });

      });

    });

  });

}
