const md5 = require('./utils/md5');

const encryptedKeys = {
  arkKey: md5.encrypt(''), //豆包API  KEY
  arkModel: md5.encrypt(''),//火山方舟在线推理的名称
  t1qqKey: md5.encrypt('')//应天诸葛API 的key https://api.t1qq.com/doc/26
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
