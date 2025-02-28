const DEFAULT_ERROR_MSG = 'Unhandled Error'
const DEFAULT_ERROR_STATUS_CODE = 500
const DEFAULT_ERROR_NAME = ''

export default class CustomError extends Error {
  message: string = DEFAULT_ERROR_MSG
  status: number = DEFAULT_ERROR_STATUS_CODE
  name: string = DEFAULT_ERROR_NAME
  error?: any
  data?: any

  constructor(e?: any, error?: any) {
    super()

    this.message = e?.message || DEFAULT_ERROR_MSG
    this.status = e?.status || DEFAULT_ERROR_STATUS_CODE
    this.name = e?.name || DEFAULT_ERROR_NAME
    this.data = e.data || error
  }
}