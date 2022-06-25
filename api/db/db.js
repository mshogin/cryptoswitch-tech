var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require("pg-promise")(/*options*/);
var password = process.env.DB_PASSWORD;
var host = process.env.DB_HOST;
var connectionString = "postgres://gct:"+password+"@"+host+":5432/gct";
console.log(connectionString);
var db = pgp(connectionString);
// add query functions

module.exports = {
    getHistoricalData: getHistoricalData,
    getLastCandle: getLastCandle,
    getHistoricalOrders: getHistoricalOrders,
    getLastTrade: getLastTrade,
};

function getLastCandle(req, res, next) {
    db.any(`
select tt.ts, tt.open, tt.high, tt.low, tt.close
  from (
select first_value(t.ts) over (partition by t.minut order by t.ts asc) as ts,
       first_value(t.close) over (partition by t.minut order by t.ts asc) as open,
       max(t.close) over (partition by t.minut) as high,
       min(t.close) over (partition by t.minut) as low,
       first_value(t.close) over (partition by t.minut order by t.ts desc) as close
         from (
           select
             ts,
             close,
             concat(extract(hour from ts), ':', extract(minute from ts)) as minut
             from lastcandle
         ) as t
 order by t.ts desc
  ) tt
 group by tt.ts, tt.open, tt.high, tt.low, tt.close
 order by tt.ts desc
`)
        .then(function (data) {
            var candles = [];
            for (let i = 0; i < data.length; i++) {
                candles.push([
                    Date.parse(data[i].ts),
                    data[i].open,
                    data[i].high,
                    data[i].low,
                    data[i].close,
                    data[i].volume
                ]);
            }
            res.status(200)
                .json({
                    status: 'success',
                    data: candles,
                    message: 'Last candles'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getHistoricalData(req, res, next) {
    db.any('select * from candle order by timestamp asc ')
        .then(function (data) {
            var candles = [];
            for (let i = 0; i < data.length; i++) {
                let ts = new Date(data[i].timestamp);
                let utc = new Date(ts.getTime() + ts.getTimezoneOffset() * 60000);
                candles.push([
                    utc.getTime(),
                    data[i].open,
                    data[i].high,
                    data[i].low,
                    data[i].close,
                    data[i].volume
                ]);
            }
            res.status(200)
                .json({
                    status: 'success',
                    data: candles,
                    message: 'Historical data for the last 1500 minutes'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getHistoricalOrders(req, res, next) {
    db.any(`
select ts, case when side = 'BUY' then 1 else 0 end as state, price
from trade_history
where ts > now() - interval '24 hours'
   and status = 'FILLED'
   and strategy = 'ALPHA'
order by ts desc
`)
        .then(function (data) {
            var orders = [];
            for (let i = 0; i < data.length; i++) {
                orders.push([
                    Date.parse(data[i].ts),
                    data[i].state,
                    data[i].price
                ]);
            }
            res.status(200)
                .json({
                    status: 'success',
                    data: orders,
                    message: 'Order history for the last 48 hours'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getLastTrade(req, res, next) {
    db.any(`
select tt.ts, tt.price, tt.volume
  from (
select first_value(t.ts) over (partition by t.minut order by t.ts asc) as ts,
       first_value(t.price) over (partition by t.minut order by t.ts desc) as price,
       sum(t.volume) over (partition by t.minut) as volume
         from (
           select
             timestamp as ts,
             price,
             amount * price as volume,
             concat(extract(hour from timestamp), ':', extract(minute from timestamp)) as minut
             from trade
             where timestamp > now() - interval '5 min'
         ) as t
 order by t.ts desc
  ) tt
 group by tt.ts, tt.price, tt.volume
 order by tt.ts desc
`)
        .then(function (data) {
            var candles = [];
            for (let i = 0; i < data.length; i++) {
                candles.push([
                    Date.parse(data[i].ts),
                    data[i].price,
                    data[i].volume
                ]);
            }
            res.status(200)
                .json({
                    status: 'success',
                    data: candles,
                    message: 'Last trades'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}
