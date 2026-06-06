export function makeCapitilized(text: string): string {
  if (!text) return ''
  const words = text.split(' ')
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
