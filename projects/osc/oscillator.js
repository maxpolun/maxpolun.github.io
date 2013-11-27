(function (window, undefined){
var Osc = window.Osc || {};

Osc.Oscillator = function(frequency, phase){
  this.frequency = frequency
  this.phase = phase
};
Osc.Oscillator.prototype.setFn = function(fnName) {
  this.fn = Osc.Oscillator.fns[fnName]
  this.fnName = fnName
};

Osc.Oscillator.fns = {
  sine: Math.sin,
  square: function (t){
    return (Math.sin(t) > 0) ? -1 : 1
  },
  sawtooth: function(t) {
    var period = 2 * Math.PI
    return 2*(t/period - Math.floor(0.5 + t/period))
  },
  triangle: function(t){
    return 2*Math.abs(Osc.Oscillator.fns.sawtooth(t))-1
  }
}

window.Osc = Osc
})(window)
