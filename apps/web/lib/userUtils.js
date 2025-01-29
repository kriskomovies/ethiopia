export const getTransformedUser = (user) => {
  const userObject = { ...user, id: user._id.toString() };
  delete userObject?._id;
  delete userObject?.password;
  delete userObject?.wallet?.privateKey;
  return userObject;
};

export const userToObject = (user) => {
  const { username, email, wallet } = user;
  const walletPublicKey = wallet.publicKey;

  const userObject = {
    id: user._id.toString(),
    username,
    email,
    walletPublicKey,
  };
  return userObject;
};
