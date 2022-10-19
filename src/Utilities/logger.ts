/**
 * Create named loggers.
 * @param name The logger name.
 * @returns a set with loggers.
 */
function Logger(name: string) {
  /**
   * Log with level DEBUG.
   * @param args Arguments.
   */
  function LOG(...args: any[]) {
    console.debug(`${name}:`, ...args);
  }

  /**
   * Log with level INFO.
   * @param args Arguments.
   */
  function INFO(...args: any[]) {
    console.info(`${name}:`, ...args);
  }

  /**
   * Log with level ERROR.
   * @param args Arguments.
   */
  function ERROR(...args: any[]) {
    console.error(`${name}:`, ...args);
  }

  /**
   * Log with level WARN.
   * @param args Arguments.
   */
  function WARN(...args: any[]) {
    console.warn(`${name}:`, ...args);
  }

  return { LOG, INFO, ERROR, WARN, };
}

export default Logger;
