const { ObjectId } = require('mongodb');

function isValidObjectId(id) {
  return typeof id === 'string' && ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

module.exports = { isValidObjectId };
