const userRepository = require('../repo/updateUserRepo');

exports.updateUser = async (id, data) => {
  const user = await userRepository.update(id, data);
  return user;
};
