const convertIntToFloat = (price: number): string => {
  return (price / 100).toFixed(2);
};

const convertFloatToInt = (price: number): number => {
  return price * 100;
};

export { convertIntToFloat, convertFloatToInt };
