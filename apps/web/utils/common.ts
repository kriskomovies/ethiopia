export const getTextColorBasedOnStatus = (status: string): string => {
  if (status === 'confirmed' || status === 'ACTIVE') {
    return 'text-green-500';
  } else if (status === 'rejected' || status === 'INACTIVE') {
    return 'text-red-500';
  }
  return 'text-yellow-500';
};

export const truncateWallet = (
  wallet: string,
  numberOfCharacters: number,
): string => {
  return `${wallet.slice(0, numberOfCharacters)}...${wallet.slice(-numberOfCharacters)}`;
};
