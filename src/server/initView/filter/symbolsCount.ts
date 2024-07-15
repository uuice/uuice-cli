export const symbolsCount = (input: string): number => {
  // Remove HTML tags
  const strippedText = input.replace(/<[^>]+>/g, '')

  // Remove whitespace and invisible characters
  const cleanedText = strippedText.replace(
    /[\s\u200b-\u200f\u2028-\u202f\u205f-\u206f\ufeff]+/g,
    ''
  )
  // Count the number of characters in the cleaned text
  return cleanedText.length
}
