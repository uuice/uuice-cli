import { v5 as uuidV5 } from 'uuid'

const nameSpace = '377b7945-cda0-4fc1-bf13-8fcf4256afdc'

export const generateUUID = (str: string): string => {
  return uuidV5(str, nameSpace)
}
