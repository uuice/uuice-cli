import moment from 'moment'

export const date = (str: string, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  return moment(str).format(format)
}
