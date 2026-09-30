import { useEffect, useState } from 'react'

/** Lee una variable CSS del `:root` en vivo: el showcase muestra el token real, no una copia. */
export function useToken(name) {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(name).trim())
  }, [name])

  return value
}
