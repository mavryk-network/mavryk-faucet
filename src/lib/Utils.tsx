export const minifyTezosAddress = (address: string): string => {
  if (address)
    return `${address.substring(0, 4)}...${address.substring(
      address.length - 4,
      address.length,
    )}`;
  return address;
};

const splitNumber = (x: number) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const roundBalance = (balance: number): number =>
  Math.trunc(balance / 10000) / 100;

export const toBalance = (balance: number): string => {
  let roundedBalance = roundBalance(balance);
  return splitNumber(roundedBalance);
};

export const getMainData = (data: string): string =>
  data.split("").reverse().join("");

export const getPlainData = (data: string): string =>
  Buffer.from(data, "base64").toString("utf8");

export const autoSelectInputText = (e: React.SyntheticEvent) => {
  const el = e.target as HTMLInputElement;
  el.focus();
  el.select();
};
