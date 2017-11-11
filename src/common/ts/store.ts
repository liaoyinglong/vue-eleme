export function saveToLocal(id: string, key: string, value: string) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    seller = JSON.parse(seller)
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  window.localStorage.__seller__ = JSON.stringify(seller)
}

export function loadFromLocal(id: string, key: string, def: string) {
  let seller: string = window.localStorage.__seller__
  if (!seller) {
    return def
  }
  let sellerID: string = JSON.parse(seller)[id]
  if (!sellerID) {
    return def
  }
  let ret: string = sellerID[key]
  return ret || def
}
