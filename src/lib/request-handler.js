import { curry } from 'ramda'
import log from './logger/logger'

export const SuccessHandler = curry((cb, { body = '', status = 200, headers = {} }) => {
  const response = {
    statusCode: status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      ...headers
    },
    body: typeof body === 'object' ? JSON.stringify(body) : body
  }
  log.info({
    ...response,
    body
  })
  cb(null, response)
})

export const ErrorHandler = curry((cb, { description = '', error = null, status = 501, headers = {} }) => {
  const response = {
    headers,
    statusCode: status,
    body: JSON.stringify({
      description,
      error
    })
  }
  log.error({
    ...response,
    body: {
      description,
      error
    }
  })
  cb(null, response)
})

export default (handler) => {
  function Wrapper (event, context, cb) {
    log.info({ event })
    handler(event, context, {
      success: SuccessHandler(cb),
      error: ErrorHandler(cb)
    })
  }
  Wrapper.WrappedHandler = handler
  return Wrapper
}