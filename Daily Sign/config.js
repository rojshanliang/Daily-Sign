const md5 = require('./utils/md5');

const encryptedKeys = {
  arkKey: md5.encrypt('f8a78a12-df3f-4ea0-8cbb-ee4f30721274'),
  arkModel: md5.encrypt('ep-20240920212434-8mct2'),
  t1qqKey: md5.encrypt('3XVUJCg1YmINPt3VXQhQiy8KDT')
};

module.exports = {
  getArkKey: function() {
    return md5.decrypt(encryptedKeys.arkKey);
  },
  getArkModel: function() {
    return md5.decrypt(encryptedKeys.arkModel);
  },
  getT1qqKey: function() {
    return md5.decrypt(encryptedKeys.t1qqKey);
  }
};