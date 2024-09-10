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
