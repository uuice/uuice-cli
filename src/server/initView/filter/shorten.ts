export const shorten = (str: string, count: number): string => {
  return str.slice(0, count || 5)
}
