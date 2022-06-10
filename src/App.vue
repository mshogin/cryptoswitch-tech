<template>
    <trading-vue
        :data="chart"
        :width="this.width"
        :height="this.height"
        skin="darkside"
        :toolbar="true"
    >
    </trading-vue>

</template>

<script>
import {TradingVue, DataCube} from "trading-vue-js";

export default {
    name: "app",
    components: { TradingVue },
    props: {
        titleTxt: {
            type: String,
            "default": 'CryptoSwitch'
        }
    },
    data() {
        return {
            chart: new DataCube({
                chart: {
                    type: "Candles",
                    data:[
                        [1652638440000,29976,29991,29972,29989,162186.0254],
                        [1652638380000,29941,29978,29941,29976,262190.274],
                        [1652638320000,29970,29970,29924,29941,367089.0866],
                        [1652638260000,29981,29981,29967,29970,433508.9222],
                        [1652638200000,29959,29986,29959,29981,467224.9679],
                        [1652638140000,29960,29962,29956,29959,57822.861]
                    ]
                }
                // onchart: [
                //     {
                //         name: "Trades",
                //         type: "Trades",
                //         data:[
                //             [1651676702000,1,38780],
                //             [1651677276000,0,38760],
                //             [1651773584000,0,36800],
                //             [1651773784000,0,36800],
                //         ],
                //         settings: {
                //             "legend": true,
                //             "z-index": 1,
                //             showLabel: true,
                //             markerSize: 20
                //         }
                //     }
                // ]
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
        }
        // async fetchOrderHistory() {
        //     try {
        //         let rawResponse = await fetch("//localhost:3000/api/v1/orderhistory");
        //         let response = await rawResponse.json()
        //         console.log("historicaldata", response.status)
        //         if (response.status == 'success') {
        //             this.data.set('onchart.0.data', resp.data)
        //         } else {
        //             console.log("fetchOrderHistory.FAILED")
        //         }
        //     } catch (error) {
        //         console.log(error);
        //     }
        // },
        // async fetchHistoricalData() {
        //     try {
        //         let rawResponse = await fetch("//localhost:3000/api/v1/historicaldata");
        //         let response = await rawResponse.json()
        //         console.log("historicaldata", response.status)
        //         if (response.status == 'success') {
        //             // console.log(response.data);
        //             // this.data.set('chart.data', response.data)
        //             // this.updateTicker();
        //             // this.fetchOrderHistory()
        //         } else {
        //             console.log("fetchHistoricalData.FAILED")
        //         }
        //     } catch (error) {
        //         console.log(error);
        //     }
        // },
        // async updateTicker() {
        //     setInterval(async () => {
        //         try {
        //             let rawResponse = await fetch("//localhost:3000/api/v1/lastcandle");
        //             var response = await rawResponse.json()
        //             console.log("lastcandle: ", response.status)
        //             if (response.status == 'success') {
        //                 // console.log(trade)
        //                 let ohlcv = this.data.data.chart.data
        //                 let last = ohlcv[ohlcv.length - 1]
        //                 console.log("last")
        //                 console.log(last)
        //                 this.data.update({
        //                     price:  response.data[0]["close"],
        //                     volume: response.data[0]["volume"]
        //                     // candle: [
        //                     //   tick[0],
        //                     //   tick[1],
        //                     //   tick[2],
        //                     //   tick[3],
        //                     //   tick[4],
        //                     //   tick[5]
        //                     // ],
        //                     // 'EMA': 8576, // query => value
        //                     // 'BB': [8955, 8522] // query => [value, value, ...]
        //                 })
        //             } else {
        //                 console.log("updateTicker.FAILED")
        //             }
        //         } catch (error) {
        //             console.log(error);
        //         }
        //     }, 3000)
        // }
    },
    mounted() {
        window.addEventListener("resize", this.onResize);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.onResize);
    },
    created() {
        // this.fetchHistoricalData();
    },
};
</script>
