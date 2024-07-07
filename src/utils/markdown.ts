import { marked } from 'marked'
// @ts-ignore
import markToc from 'markdown-toc'
import highlight from 'highlight.js'
import md5 from 'md5'

/**
 * markdown to toc
 * @return {} []
 */
export const markdownToToc = async (content: string): Promise<string> => {
  return (await marked((markToc as any)(content).content)).replace(
    /<a\s+href="#([^"]+)">([^<>]+)<\/a>/g,
    (a, b, c) => {
      return `<a href="#${generateTocName(c)}">${c}</a>`
    }
  )
}

/**
 * markdown to html
 * @return {} []
 */
export const markdownToHtml = async (content: string): Promise<string> => {
  const markedContent = (await marked(content)).replace(/<h(\d)[^<>]*>(.*?)<\/h\1>/g, (a, b, c) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (b | (0 === 2)) {
      return `<h${b} id="${generateTocName(c)}">${c}</h${b}>`
    }
    return `<h${b} id="${generateTocName(c)}"><a class="anchor" href="#${generateTocName(
      c
    )}"></a>${c}</h${b}>`
  })
  return markedContent.replace(
    /<pre><code\s*(?:class="(lang|language)-(\w+)")?>([\s\S]+?)<\/code><\/pre>/gm,
    (a, b, language, text) => {
      text = text
        .replace(/&#39;/g, "'")
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
      const result = highlight.highlightAuto(text, language ? [language] : undefined)
      return `<pre><code class="hljs lang-${result.language}">${result.value}</code></pre>`
    }
  )
}

/**
 * generate toc name
 * @return {String}      []
 * @param name
 */
export const generateTocName = (name: string): string => {
  name = name.trim().replace(/\s+/g, '').replace(/\)/g, '').replace(/[(,]/g, '-').toLowerCase()
  if (/^[\w-]+$/.test(name)) {
    return name
  }
  return `toc-${md5(name).slice(0, 6)}`
}
