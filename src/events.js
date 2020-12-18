export function bindEvents(){
  [
    ['scope', 'input' , onInput],
    ['scope', 'change', onRangeChange],
    ['scope', 'click' , onButtonClick],
    ['value', 'change', onValueChange],
  ].forEach(([elm, event, cb]) =>
    this.DOM[elm].addEventListener(event,  cb.bind(this))
  )

  window.addEventListener('wheel', onWheelMove.bind(this));
  window.addEventListener('storage', onStorage.bind(this))

  // assuming picker uses as a popup
  if( this.settings.onClickOutside ){
    document.body.addEventListener('click', onClickOutside.bind(this))
    window.addEventListener('keydown', onkeydown.bind(this))
  }
}

function onStorage(){
  this.syncGlobalSwatchesWithLocal()
}

function onWheelMove(e){
  const { value, max } = e.target,
        delta = Math.sign(e.deltaY) * -1 // normalize jump value to either -1 or 1

  // since the event is on the window object, the callback will be fired in all
  // instances, therefore only the currently "active" picker should be used.
  if( this.DOM.scope.contains(e.target) ){
    e.target.value = Math.min(Math.max(+value + delta, 0), +max)
    onInput.call(this, e)
  }
}

function onkeydown(e){
  if( e.key == 'Escape' )
    this.settings.onClickOutside(e)
}

function onClickOutside(e){
  if( !this.DOM.scope.contains(e.target) )
    this.settings.onClickOutside(e)
}

function  onInput(e){
  const {name, value, type} = e.target

  if( type == 'range' ){
    this.setColor({...this.color, [name[0]]: +value})
  }
}

function onRangeChange(e){
  const { type } = e.target

  if( type == 'range' || type == 'text' ){
    this.history.last = this.color
  }
}

function onValueChange(e){
  this.setColor( this.getHSLA(e.target.value) )
  this.DOM.value.blur()
}

function onButtonClick(e){
  const { name, parentNode:pNode, classList, title } = e.target

  // switch(name){
  //   case
  // }
  if( name == 'format' )
    this.swithFormat()

  else if( name == 'undo' )
    this.history.undo()

  else if( name == 'addSwatch' )
    this.addSwatch()

  else if( name == 'removeSwatch' )
    this.removeSwatch(pNode, pNode.title)

  else if( classList.contains('color-picker__swatch') && title )
    this.setColor( this.getHSLA(title) )
}