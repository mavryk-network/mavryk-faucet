/**
 *
 * @param ms number of miliseconds to block thread
 * @returns promise that will resolve after @ms miliseconds passed
 */
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
