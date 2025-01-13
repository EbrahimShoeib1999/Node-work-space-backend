const userRepository = require('../repo/updateUserRepo');

exports.updateUser = async (id, data) => {
  const user = await userRepository.update(id, data);
  return user;
};

exports.getUserById = async (id) => {
  if (!id) {
    throw new Error('User ID is required');
  }

  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};