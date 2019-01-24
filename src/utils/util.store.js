class Store {
  constructor() {
    this.storage = {};
  }

  getByKey(key) {
    let result;
    try {
      // eslint-disable-next-line
      result = this.storage[key];
    } catch (e) {
      console.log(`Unable to get [${key}] from store.`);
      console.log('error:', e);
      result = null;
    }

    return result;
  }

  setByKey(key, value) {
    if (!key || !value) {
      console.log('store:', 'Key or value not set.');
    }
    try {
      // eslint-disable-next-line
      this.storage[key] = value;
    } catch (e) {
      console.log(`Unable to set [${key}]=${value} to store.`);
      console.log('error:', e);
    }
  }
}

module.exports = Store;
