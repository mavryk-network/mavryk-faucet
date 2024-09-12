export const formatNumber = ({
  number,
  decimalsToShow = 0,
}: {
  number: number;
  decimalsToShow?: number;
}) => {
  return number.toLocaleString("en-US", {
    maximumFractionDigits: decimalsToShow,
  });
};

export const shortenAddress = (str: string, startLength = 7, endLength = 4) => {
  if (str.length <= startLength + endLength) {
    return str; // If the string is already shorter than the desired length, return the original string
  }

  var start = str.substring(0, startLength); // Extract the first part of the string
  var end = str.substring(str.length - endLength); // Extract the last part of the string

  return start + "..." + end;
};
