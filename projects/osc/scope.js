(function (window, undefined){
var Osc = window.Osc || {}

function Point(x, y){
  this.x = x
  this.y = y
}
function Rect(corner, width, height){
  this.corner = corner
  this.width = width
  this.height = height
}

function getCanvasObj(canvasId){
  this.canvas = window.document.getElementById(canvasId)
  this.context = this.canvas.getContext('2d')
  this.area = new drawArea(new Rect(new Point(0, 0), this.canvas.width, this.canvas.height), 0, 2*Math.PI, 1024)
}

Osc.FnDisplay = function(canvasId){
  getCanvasObj.call(this, canvasId)
};

function canvasY(y, height){
  return (height-(y*height))/2
}

function drawArea(rect, start, end, sampleCount){
  this.rect = rect
  this.start = start
  this.end = end
  this.sampleCount = sampleCount
}

function drawWithAxes(ctx, area, frequency, phase, fn){
  var innerArea = drawAxes(ctx, area)
  drawFunction(ctx, innerArea, frequency, phase, fn)
}

function drawAxes(ctx, area){
  var w = area.rect.width
  var h = area.rect.height
  var start = area.start
  var end = area.end
  var axisSize = 50

  withContext(ctx, function(){
    ctx.clearRect(0, 0, w, h)

    ctx.fillStyle = "rgb(0,0,0)"
    ctx.fillRect(0,0, w, h)

    ctx.strokeStyle = "white"
    ctx.lineWidth = "1"

    ctx.moveTo(axisSize, 0)
    ctx.lineTo(axisSize, h)

    labelYAxes(ctx, area, -1, 1, axisSize)

    ctx.moveTo(axisSize, h/2)
    ctx.lineTo(w, h/2)

    labelXAxes(ctx, area, start, end, axisSize)

    ctx.stroke()
  })
  var rect = new Rect(new Point(area.rect.corner.x+axisSize, area.rect.corner.y+axisSize/2), 
          w - axisSize, h - axisSize)
  return new drawArea(rect, area.start, area.end, area.sampleCount)
}

function labelYAxes(ctx, area, end, start, size) {
  var w = area.rect.width
  var h = area.rect.height
  for (var i = 1; i < 10; i++) {
    ctx.moveTo(size-5, (h/10)*i)
    ctx.lineTo(size+5, (h/10)*i)

    var step = (end-start)/10
    var labelText = start + step*i
    ctx.strokeText(String(labelText).substr(0, 4), size - 25, (h/10)*i + 3)
  }
}

function labelXAxes(ctx, area, start, end, size) {
  var w = area.rect.width
  var h = area.rect.height
  for (var i = 0; i < 10; i++) {
    var x = size + ((w-size)/10)*i
    var y = h/2
    ctx.moveTo(x, y-5)
    ctx.lineTo(x, y+5)

    var step = (end-start)/10
    var labelText = start + step*i
    ctx.strokeText(String(labelText).substr(0, 4), x - 5, y + 15)
  }
}

function drawFunction(ctx, area, frequency, phase, fn){
  var w = area.rect.width
  var h = area.rect.height
  var top = area.rect.corner
  var start = area.start
  var end = area.end
  var sampleCount = area.sampleCount
  var dt = (end-start)/sampleCount

  withContext(ctx, function(){
    ctx.strokeStyle = "rgb(0,64,0)"
    ctx.lineWidth = "2"
    ctx.moveTo(top.x, top.y + canvasY(fn(start)))
    for(var t = start; t < end; t += dt) {
      var x = w * (t/(end-start))
      ctx.lineTo(top.x + x, top.y + canvasY(fn((t+phase*2*Math.PI)*frequency), h))
    }
    ctx.stroke()
  })
}

function withContext(ctx, cb){
  ctx.beginPath()
  ctx.save()
  cb(ctx)
  ctx.restore()  
}

Osc.FnDisplay.prototype.draw = function(osc){
  drawWithAxes(this.context, this.area, 1, 0, osc.fn)
};

Osc.TimeDisplay = function(canvasId){
  getCanvasObj.call(this, canvasId)
  this.sampleCount = 4096
}
Osc.TimeDisplay.prototype.draw = function(osc, time){
  this.area.end = time
  drawWithAxes(this.context, this.area, osc.frequency, osc.phase, osc.fn)
}

window.Osc = Osc
})(window)
