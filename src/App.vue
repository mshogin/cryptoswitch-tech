<template>
    <trading-vue
        :data="data"
        :width="this.width"
        :height="this.height"
        skin="darkside"
        :toolbar="true"
        :chart-config="{TB_ICON_BRI: 1.25}"
    >
    </trading-vue>

</template>

<script>
import {TradingVue, DataCube, Grid} from "trading-vue-js";

export default {
    name: "app",
    components: { TradingVue, Grid },
    props: {
        titleTxt: {
            type: String,
            "default": 'TradingVue.js'
        }
    },
    data() {
        return {
            tf: "1m",
            data: new DataCube({
                chart: {
                    type: "Candles",
                    data:[]
                },
                onchart: [
                    {
                        name: "Trades",
                        type: "Trades",
                        data:[
                            // [1651676702000,1,38780],
                            // [1651677276000,0,38760],
                            // [1651773584000,0,36800],
                            // [1651773784000,0,36800],
                        ],
                        settings: {
                            "legend": true,
                            "z-index": 1,
                            showLabel: true,
                            markerSize: 20
                        }
                    }
                ]
            }),
            width: window.innerWidth,
            height: window.innerHeight,
            colors: {
                colorBack: "#fff",
                colorGrid: "#eee",
                colorText: "#333",
            },
        };
    },
    methods: {
        onResize(event) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        },
        async fetchOrderHistory() {
            try {
                let response = await fetch("/api/v1/orderhistory");
                let resp = await response.json()
                console.log(resp)
                this.data.set('onchart.0.data', resp.data)
                console.log(this.data)
            } catch (error) {
                console.log(error);
            }
        },
        async fetchHistoricalData() {
            try {
                let response = await fetch("/api/v1/historicaldata");
                let rr = await response.json()
                this.data.set('chart.data', rr)
                this.updateTicker();
                this.fetchOrderHistory()
            } catch (error) {
                console.log(error);
            }
        },
        async updateTicker() {
            setInterval(async () => {
                try {
                    let response = await fetch("/api/v1/lasttrade");
                    var trade = await response.json()
                    // console.log(trade)
                    let ohlcv = this.data.data.chart.data
                    let last = ohlcv[ohlcv.length - 1]
                    console.log("last")
                    console.log(last)
                    this.data.update({
                        price:  trade["price"],
                        volume: trade["amount"]
                        // candle: [
                        //   tick[0],
                        //   tick[1],
                        //   tick[2],
                        //   tick[3],
                        //   tick[4],
                        //   tick[5]
                        // ],
                        // 'EMA': 8576, // query => value
                        // 'BB': [8955, 8522] // query => [value, value, ...]
                    })
                } catch (error) {
                    console.log(error);
                }
            }, 3000)
        }
    },
    mounted() {
        window.addEventListener("resize", this.onResize);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.onResize);
    },
    created() {
        this.fetchHistoricalData();
    },
};
</script>
