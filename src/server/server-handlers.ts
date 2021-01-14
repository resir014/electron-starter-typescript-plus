import { ServerHandlers } from 'interfaces/common'

const serverHandlers: ServerHandlers = {}

serverHandlers['make-factorial'] = async ({ num }: { num: number }) => {
  function fact(n: number): number {
    if (n === 1) {
      return 1
    }
    return n * fact(n - 1)
  }

  console.log('making factorial')
  return fact(num)
}

serverHandlers['ring-ring'] = async () => {
  console.log('picking up the phone')
  return 'hello!'
}

export default serverHandlers
