export function saveToLocal(id, key, value) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    // localStorage存储的是一段字符串
    seller = JSON.parse(seller)
    if (!seller[id]) {
      sell[id] = {}
    }
  }
  seller[id][key] = value
  window.localStorage.__seller__ = JSON.stringify(seller)
}

export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    return def
  }
  let sellerID = JSON.parse(seller)[id]
  if (!sellerID) {
    return def
  }
  let ret = sellerID[key]
  return ret || def
} 