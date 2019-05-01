class Key {
  constructor(kc, x, y, r, w, h, p, c, t, f, f2) {
    this.kc = kc
    this.x = x
    this.y = y
    this.r = r
    this.w = w
    this.h = h
    this.p = p
    this.c = c
    this.t = t
    this.f = f
    this.f2 = f2
  }

  centerX() {
    return this.x + Math.cos(this.r) * this.w / 2 - Math.sin(this.r) * this.h / 2
  }

  centerY() {
    return this.y + Math.sin(this.r) * this.w / 2 + Math.cos(this.r) * this.h / 2
  }

  cornerX() {
    return this.x
  }

  cornerY() {
    return this.y
  }

  scaleW() {
    return this.w * 19 / 18.5 - 1 / 18.5
  }

  scaleH() {
    return this.h * 19 / 18.5 - 1 / 18.5
  }

  cInt() {
    parseInt(this.c.replace('#', '0x'))
  }

  tInt() {
    parseInt(this.t.replace('#', '0x'))
  }
}

function KLEparser(raw) {
  json = raw2json(raw)
  console.log(json)
  var layout = JSON.parse(json)

  var kc = "Q"
  var ax = 0
  var ay = 0
  var w = 1
  var h = 1
  var r = 0
  var rx = 0
  var ry = 0
  var dx = 0
  var dy = 0
  var p = "DSA"
  var c = 0xcfd8dc
  var t = 0xffffff
  var f = 3
  var f2 = 3
  var keys = []
  var keyboard = {keys: keys}

  layout.forEach(function(row){
    if (Array.isArray(row)) {
      row.forEach(function(key){
        if (typeof key == 'string') {
          var kc = key
          var px = (rx + Math.cos(r) * ax - Math.sin(r) * ay)
          var py = (ry + Math.sin(r) * ax + Math.cos(r) * ay)

          keys.push(new Key(kc, px, py, r, w, h, p, c, t, f, f2))

          ax = ax + w
          w = 1
          h = 1
        } else {
          if ("w" in key) w = key.w
          if ("h" in key) h = key.h
          if ("rx" in key) {
            rx = key.rx
            ax = 0
            ay = 0
          }
          if ("ry" in key) {
            ry = key.ry
            ax = 0
            ay = 0
          }
          if ("x" in key) {
            dx = key.x
            ax = ax + dx
          }
          if ("y" in key) {
            dy = key.y
            ay = ay + dy
          }
          p = key.p ? key.p : p
          c = key.c ? key.c : c
          t = key.t ? key.t : t
          f = key.f ? parseInt(key.f) : f
          f2 = key.f2 ? parseInt(key.f2) : f2
          r = "r" in key ? key.r / 180 * Math.PI : r
        }
      })
      ax = 0
      ay++
    }
  })

  return keyboard
}

function raw2json(rawdata) {
  return "[" + rawdata
  .replace(/(\\\\)|(\\\")|(\\n)/g, "")
  .split(",")
  .map(function(str) {
    if (str.match(/^\"/)) {
      return str
    } else {
      return str.replace(/([a-z2]+):/, "\"$1\":")
    }
  })
  .join(",") + "]"
}
