import { useState, useCallback, useMemo } from 'react'

/**
 * Cart lines: { id, name, price, qty, min, step, group }
 * Quantity rules: first add jumps to `min`, then moves by `step`; going below `min` removes the line.
 */
export function useCart() {
  const [lines, setLines] = useState({})

  const add = useCallback((item, group = '') => {
    setLines(prev => {
      const cur = prev[item.id]
      if (!cur) return { ...prev, [item.id]: { ...item, group, qty: item.min ?? 1 } }
      return { ...prev, [item.id]: { ...cur, qty: cur.qty + (item.step ?? 1) } }
    })
  }, [])

  const dec = useCallback((id) => {
    setLines(prev => {
      const cur = prev[id]
      if (!cur) return prev
      const next = cur.qty - (cur.step ?? 1)
      const u = { ...prev }
      if (next < (cur.min ?? 1)) delete u[id]; else u[id] = { ...cur, qty: next }
      return u
    })
  }, [])

  const remove = useCallback((id) => setLines(prev => { const u = { ...prev }; delete u[id]; return u }), [])
  const clear = useCallback(() => setLines({}), [])

  const list = useMemo(() => Object.values(lines), [lines])
  const total = useMemo(() => list.reduce((s, l) => s + l.qty * l.price, 0), [list])
  const count = useMemo(() => list.reduce((s, l) => s + l.qty, 0), [list])

  return { lines, list, total, count, add, dec, remove, clear }
}
