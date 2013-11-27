(function($, undefined){
$(function(){
  var osc = new Osc.Oscillator(440, 0)
  osc.setFn('sine')
  var fnscope = new Osc.FnDisplay('fnscope')
  fnscope.draw(osc)
  var timescope = new Osc.TimeDisplay('timescope')
  var time = 2 * Math.PI / 440 * 4
  timescope.draw(osc, time)
  var audio = new Osc.Audio()
  $('#function').val(osc.fnName).change(function(){
    osc.setFn(this.value)
    fnscope.draw(osc)
    timescope.draw(osc, time)
  })
  $('#f').val(osc.frequency).on('input', function(){
    var num = Number(this.value)
    if(num) {
      osc.frequency = num
      timescope.draw(osc, time)
    }
  })
  $('#phase').val(osc.phase).on('input', function(){
    var num = Number(this.value)
    if(!isNaN(num) && num >= -1 && num <= 1) {
      osc.phase = num
      timescope.draw(osc, time)
    }
  })
  function updateControls() {
    $('#play').attr('disabled', audio.playing)
    $('#stop').attr('disabled', !audio.playing)
  }
  updateControls()
  $('#play').click(function(e){
    e.preventDefault()
    audio.play(osc)
    updateControls()
  })
  $('#stop').click(function(e){
    e.preventDefault()
    audio.stop()
    updateControls()
  })
})
})(jQuery)
