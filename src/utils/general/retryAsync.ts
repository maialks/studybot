export default async function retryAsync<
  T extends (...args: any[]) => Promise<any>
>(
  fn: T,
  retries: number,
  delay: number,
  ...args: Parameters<T>
): Promise<Awaited<ReturnType<T>>> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn(...args);
    } catch (err) {
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }
  throw new Error('impossible branch reached');
}
