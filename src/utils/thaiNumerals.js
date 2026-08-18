const THAI_DIGITS = '๐๑๒๓๔๕๖๗๘๙'

// e-GP titles/descriptions sometimes come through with Thai digit characters (๐-๙) embedded
// in the text itself — locale numberingSystem options only affect numbers we format ourselves,
// not raw strings from the feed, so those need an explicit character swap to Arabic digits.
export function toArabicDigits(str) {
  if (typeof str !== 'string') return str
  return str.replace(/[๐-๙]/g, d => String(THAI_DIGITS.indexOf(d)))
}
