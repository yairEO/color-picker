export function bindEvents(){
  [
    ['scope', 'input' , 'onInput'],
    ['scope', 'change', 'onRangeChange'],
    ['scope', 'click' , 'onButtonClick'],
    ['value', 'change', 'onValueChange'],
  ].forEach(([elm, event, cb]) =>
    this.DOM[elm].addEventListener(event,  this[cb].bind(this))
  )
}

export function  onInput(e){
  const {name, value, type} = e.target

  if( type == 'range' ){
    this.updateCSSVar(name, value)
    this.setColor({...this.color, [name[0]]: +value})

    e.target.parentNode.style.setProperty('--value',value);
    e.target.parentNode.style.setProperty('--text-value', JSON.stringify(value))
  }
}

export function onRangeChange(e){
  const { type } = e.target

  if( type == 'range' || type == 'text' ){
    this.history.last = this.color
  }
}

export function onValueChange(e){
  this.setColor( this.getHSLA(e.target.value) )
  this.DOM.value.blur()
}

export function onButtonClick(e){
  const { name } = e.target

  if( name == 'format' )
    this.swithFormat()

  else if( name == 'undo' )
    this.history.undo()
}