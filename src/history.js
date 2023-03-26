/**
 * Changes history manager
 */
export default function history(){
  const historyChange = () => this.settings.onChange(this.CSSColor)
  const setColor = this.setColor.bind(this)

  return {
    _value: [this.color],

    get pop(){
      return this._value.pop()
    },

    get previous(){
      return this._value[this._value.length - 2]
    },

    set last( item ){
      this._value.push(item)
      historyChange()
    },

    undo(){
      // leave one last item in the value array
      if( this._value.length > 1 ){
        // get rid of the current color
        this.pop

        // get "new" last color
        let last = this._value[this._value.length - 1]

        setColor(last)
        historyChange()

        return last
      }
    }
  }
}