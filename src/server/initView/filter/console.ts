export const Console = (data: string | object, name: string, type = 'log'): string => {
  return `<script>
    console.${type}(
      ${JSON.parse(
        // prettier-ignore
        JSON.stringify(data, null, 4)
      .replace(/&#39;/g, '\'')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      )},
      /${name}/
)
  </script>`
}
