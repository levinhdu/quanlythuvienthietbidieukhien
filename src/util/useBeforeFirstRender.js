import {useState, useEffect} from 'react'

/**
 * ComponentWillMount
 *
 * @param fun
 */
export default (fun) => {
  const [hasRendered, setHasRendered] = useState(false)

  useEffect(() => setHasRendered(true), [hasRendered])

  if (!hasRendered) {
    fun()
  }
}
