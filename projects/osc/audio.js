(function (window, undefined){
var Osc = window.Osc || {}
window.AudioContext = window.AudioContext || window.webkitAudioContext

Osc.Audio = function(){
  this.playing = false
  this.context = new window.AudioContext()
}

Osc.Audio.prototype.play = function(osc){
  if(!this.playing){
    this.playing = true
    this.oscillator = this.context.createOscillator()
    this.oscillator.frequency.value = osc.frequency
    this.oscillator.type = osc.fnName
    this.oscillator.connect(this.context.destination)
    this.oscillator.start(0)
  }
}
Osc.Audio.prototype.stop = function(){
  this.oscillator.stop(0)
  this.playing = false
}

window.Osc = Osc
})(window)
