const getBackgroundColorPerState = (
  state: 'bought' | 'available' | 'needMoreFunds',
  opacity: number,
) => {
  if (state === 'bought') {
    return `group-hover:bg-[rgba(107,114,128,${opacity})]`;
  } else if (state === 'available') {
    return `group-hover:bg-[rgba(34,197,94,${opacity})]`;
  } else {
    return `group-hover:bg-[rgba(239,68,68,${opacity})]`;
  }
};

export { getBackgroundColorPerState };
