class Key {
  constructor(x, y, r, w, h, p, c) {
    this.x = x
    this.y = y
    this.r = r
    this.w = w
    this.h = h
    this.p = p
    this.c = c
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
}

function KLEparser(jsondata) {
  var layout = JSON.parse(jsondata)

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
  var c = 0xffffff
  var keys = []
  var keyboard = {keys: keys}

  layout.forEach(function(row){
    if (Array.isArray(row)) {
      row.forEach(function(key){
        if (typeof key == 'string') {
          console.log('x:' + ax + ' y:' + ay + ' rx: ' + rx + ' ry: ' + ry + ' r: ' + r + ' key: ' + key)

          var px = (rx + Math.cos(r) * ax - Math.sin(r) * ay)
          var py = (ry + Math.sin(r) * ax + Math.cos(r) * ay)

          keys.push(new Key(px, py, r, w, h, p, c))

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
          c = key.c ? parseInt(key.c.replace('#', '0x')) : c
          r = "r" in key ? key.r / 180 * Math.PI : r
        }
      })
      ax = 0
      ay++
    } else {
      bg = row.backcolor
      if (bg) row.backcolor = parseInt(bg.replace('#', '0x'))
      keyboard.properties = row
    }
  })

  if (!keyboard.properties) {
    keyboard.properties = {backcolor: 0xffffff}
  }
  return keyboard
}
