export function handleResponse(res, code, statusMsg) {
  res.status(code).json(statusMsg)
}

export function handleErrorResponse(res, code, error) {
  let message = error.message
  if (Array.isArray(error)) {
    message = error[0].msg || error[0].message
  }
  res.status(code).json({ code: `${code}`, message })
}
