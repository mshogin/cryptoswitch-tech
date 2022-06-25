<template>
    <!-- TradingVueJs 101 (example from 'Getting Started' ) -->

    <trading-vue :data="chart" :width="this.width" :height="this.height" skin="darkside">

</trading-vue>
</template>

<script>
import {TradingVue, DataCube} from "trading-vue-js";
import Data from '../data/data.json'

export default {
    name: 'app',
    components: { TradingVue },
    strategy: ["alpha", "beta"],
    methods: {
        onResize(event) {
            this.width = window.innerWidth
            this.height = window.innerHeight
        },
        async fetchHistoricalData() {
            try {
                let rawResponse = await fetch("/api/v1/historicaldata");
                let response = await rawResponse.json()
                console.log("historicaldata", response.status)
                if (response.status == 'success') {
                    this.chart.data.chart = this.createCandlesChart(response.data)
                    this.updateTicker();
                    this.fetchOrderHistory()
                } else {
                    console.log("fetchHistoricalData.FAILED")
                }
                return []
            } catch (error) {
                console.log(error);
            }
        },
        createCandlesChart(data) {
            return {type: "Candles",data: data}
        },
        async fetchOrderHistory() {
            try {
                let rawResponse = await fetch("/api/v1/orderhistory");
                let response = await rawResponse.json()
                console.log("orderhistory", response.status)
                if (response.status == 'success') {
                    this.chart.data.onchart = [
                        this.createTradesChart(response.data)
                    ]
                } else {
                    console.log("fetchOrderHistory.FAILED")
                }
            } catch (error) {
                console.log(error);
            }
        },
        createTradesChart(data){
            return {
                name: "Trades",
                type: "Trades",
                data: data,
                settings: {
                    "legend": true,
                    "z-index": 1,
                    showLabel: true,
                    markerSize: 20
                }
            }
        },

        async updateTicker() {
            setInterval(async () => {
                try {
                    let rawResponseCandle = await fetch("/api/v1/lastcandle");
                    let rawResponseTrade = await fetch("/api/v1/lasttrade");
                    var responseCandel = await rawResponseCandle.json()
                    var responseTrade = await rawResponseTrade.json()

                    // console.log("lastcandle: ", responseCandel)
                    // console.log("lasttrade: ", responseTrade)

                    if (responseTrade.status != 'success') {
                        console.log("updateTicker.FAILED(last-trade)")
                        return
                    }
                    if (responseCandel.status != 'success') {
                        console.log("updateTicker.FAILED(last-cande)")
                        return
                    }
                    let lastCandle = responseCandel.data[0]
                    let lastTrade = responseTrade.data[0]
                    lastCandle[4] = lastTrade[1]
                    lastCandle[5] = lastTrade[2]

                    // console.log("merge candle", lastCandle)

                    this.chart.update({
                        'candle': lastCandle
                    })
                } catch (error) {
                    console.log(error);
                }
            }, 1000)
        }

    },
    mounted() {
        window.addEventListener('resize', this.onResize)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    created() {
        this.fetchHistoricalData();
    },
    data() {
        return {
            tf: '1m',
            chart: new DataCube({
                chart: {},
                onchart: []
            }),
            width: window.innerWidth,
            height: window.innerHeight,
            colors: {
                colorBack: '#fff',
                colorGrid: '#eee',
                colorText: '#333',
            }
        }
    }
}
</script>
