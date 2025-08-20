const info = (...params: unknown[]) => console.log(...params);
const error = (...params: unknown[]) => console.error(...params);
const warn = (...params: unknown[]) => console.warn(...params);

export default {
  info,
  error,
  warn,
};
