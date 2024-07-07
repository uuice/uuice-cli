export const stripHtml = (html: string): string => {
  // Regular expression to match HTML tags
  const regex = /<\/?[^>]+(>|$)/g

  // Replace all HTML tags with an empty string
  return html.replace(regex, '')
}
