const fs = require('fs');

const readFile = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading file:', err);
    return [];
  }
};

const writeFile = async (filePath, data) => {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data));
  } catch (err) {
    console.error('Error writing to file:', err);
  }
};

module.exports = { readFile, writeFile };
