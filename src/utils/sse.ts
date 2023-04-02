async function looseLoop(fn: (stop: () => void) => void, delay = 0) {
  let stopFlag = false
  const stop = () => stopFlag = true
  await new Promise<void>((resolve) => {
    const wrapper = () => {
      fn(stop)
      if (stopFlag)
        resolve()
      else
        setTimeout(wrapper, delay)
    }
    wrapper()
  })
}

function parseSSELine(line: string) {
  const pos = line.indexOf(': ')
  if (pos === -1)
    throw new Error(`Can't find ': ' in line '${line}'`)
  if (pos === 0)
    return { field: '', value: line.slice(2) }
  return {
    field: line.slice(0, pos),
    value: line.slice(pos + 2),
  }
}

function parseSSEMessage(message: string) {
  const lines = message.split('\n')
  const lineFields: string[] = []
  const lineValues: string[] = []
  for (const line of lines) {
    const { field, value } = parseSSELine(line)
    lineFields.push(field)
    lineValues.push(value)
  }
  if (new Set(lineFields).size > 1) {
    throw new Error(
      `Multiple fields appear in a message: ${new Set(lineFields).values()}`,
    )
  }
  return { field: lineFields[0], value: lineValues.join('\n') }
}

export function useSSEResponse(
  response: Response,
  options: {
    onmessage?: (field: string, value: string) => void
    onclose?: () => void
  } = {},
) {
  const { onmessage, onclose } = options

  const reader = response.body?.getReader()
  if (!reader)
    return

  const textDecoder = new TextDecoder()
  let done = false
  let buf = ''
  looseLoop(async (stop) => {
    // check
    if (done) {
      stop()
      onclose?.()
      return
    }
    const result = await reader.read()
    done = result.done
    if (!result.value)
      return
    // get messages from buf
    buf += textDecoder.decode(result.value)
    const messages = buf.split('\n\n')
    buf = messages[messages.length - 1]
    if (messages.length < 2)
      return
    // parse messages
    for (let i = 0; i < messages.length - 1; i++) {
      const message = messages[i]
      const { field, value } = parseSSEMessage(message)
      onmessage?.(field, value)
    }
  })
}
