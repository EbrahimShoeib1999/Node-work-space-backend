const { User } = require('../model/updateUserModel');

exports.findById = async (id) => {
  return User.findByPk(id);
};

exports.update = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  return user.update(data);
};
