import moment from 'moment'

export const date = (str: string, format: string): string => {
  return moment(str).format(format)
}
