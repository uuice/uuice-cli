export const symbolsCount = (input: string): number => {
  if (!input) {
    return 0
  }

  return input?.trim()?.match(/\S/g)?.length || 0
}
