import { Overlay } from 'trading-vue-js'

export default {
  name: 'OrderHistory',
  mixins: [Overlay],
  methods: {
    use_for() { return ['OrderHistory'] },
    draw(ctx) {
      let layout = this.$props.layout // Layout object (see API BOOK)
      console.log(layout)
      ctx.lineWidth = 1.5
      ctx.strokeStyle = 'black'
      for (var p of this.$props.data) {
        ctx.fillStyle = p[1] ? '#bfff00' : '#ec4662'
        ctx.beginPath()
        let x = layout.t2screen(p[0]) // x - Mapping
        let y = layout.$2screen(p[2]) // y - Mapping
        ctx.arc(x, y, 5.5, 0, Math.PI * 2, true) // Trade point
        ctx.fill()
        ctx.stroke()
      }
    }
  }
}
