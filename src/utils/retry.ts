interface RetryOption {
  retryCount: number;
  retryDelay: number;
}

export const retry = async (
  { retryCount = 3, ...restOptions }: RetryOption,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asyncFunc: (...params: any) => Promise<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...params: any[]
): // eslint-disable-next-line @typescript-eslint/no-explicit-any
Promise<any> => {
  try {
    return await asyncFunc(...params);
  } catch (error) {
    if (retryCount === 1) {
      throw error;
    }
    await new Promise(resolve => setTimeout(resolve, restOptions.retryDelay || 1000));
    // eslint-disable-next-line no-return-await
    return await retry(
      { retryCount: retryCount - 1, ...restOptions },
      asyncFunc,
      ...params,
    );
  }
};
