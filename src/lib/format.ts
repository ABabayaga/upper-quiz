export function cleanInstagram(value: string) {
    return value
      .trim()
      .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
      .replace(/^@+/, '')
      .replace(/[/?#].*$/, '')
      .toLowerCase()
  }
  
  export function formatSeconds(ms: number) {
    return (ms / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 's'
  }