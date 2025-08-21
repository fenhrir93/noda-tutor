const { readFile } = require('../util/fileUtils');

class BaseModel {
  constructor() {}

  static async getItems(pathToFile) {
    const items = await readFile(pathToFile, 'utf-8');
    return items;
  }
}

module.exports = BaseModel;
