export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (_e) {
    return false;
  }
  return true;
}
