import { useState, useCallback, useMemo, useEffect } from 'react'
import { CATALOGUE, CHINCHIN_SIZES, SOLD_OUT_FLAVOURS } from '../data/menu.js'

const KEY = 'ed-cart-v1'
const MAX_AGE = 7 * 24 * 60 * 60 * 1000   // forget carts older than a week

// Current catalogue entry for a saved line, so prices/minimums are never stale.
const CATALOGUE_ITEMS = Object.fromEntries(
  CATALOGUE.flatMap(c => c.groups.flatMap(g => g.items.map(it => [it.id, { ...it, group: c.title }])))
)
function fresh(line) {
  const base = CATALOGUE_ITEMS[line.id]
  if (base) return base.soldOut ? null : { ...base, qty: line.qty }
  const m = /^cc-(.+)-([^-]+)$/.exec(line.id)           // chin-chin: cc-<flavour>-<sizeKey>
  if (m) {
    const size = CHINCHIN_SIZES.find(s => s.key === m[2])
    if (!size || SOLD_OUT_FLAVOURS.includes(m[1])) return null
    return { id: line.id, name: `${m[1]} Chin-Chin, ${size.label}`, price: size.price, min: size.min, step: 1, group: 'Chin-Chin', qty: line.qty }
  }
  return null                                            // item no longer on the menu
}

function load() {
  try {
    const o = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (!o || typeof o !== 'object' || Date.now() - (o.t || 0) > MAX_AGE) return {}
    const out = {}
    for (const l of Object.values(o.lines || {})) {
      if (!l || typeof l.id !== 'string' || !Number.isFinite(l.qty) || l.qty < 1) continue
      const f = fresh(l)
      if (f) out[f.id] = { ...f, qty: Math.max(f.min ?? 1, Math.round(l.qty)) }
    }
    return out
  } catch { return {} }          // storage blocked or corrupt: start empty
}
function save(lines) {
  try {
    if (Object.keys(lines).length) localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), lines }))
    else localStorage.removeItem(KEY)
  } catch { /* private mode / quota: cart just won't persist */ }
}

/**
 * Cart lines: { id, name, price, qty, min, step, group }
 * Quantity rules: first add jumps to `min`, then moves by `step`; going below `min` removes the line.
 */
export function useCart() {
  const [lines, setLines] = useState(load)
  useEffect(() => { save(lines) }, [lines])

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
