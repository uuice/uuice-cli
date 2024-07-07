import moment from 'moment'

export const dateFormat = (date: Date | string | undefined, format: string): string => {
  return moment(date).format(format)
}
