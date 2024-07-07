import Color from 'colorjs.io'

export const getColor = (l: number, c: number, h: number) => {
  return getColorNode(l, c, h)
}

function getColorNode(l: number, c: number, h: number): string {
  return new Color('oklch', [l, c, h]).to('srgb').toString({ format: 'hex' })
}
