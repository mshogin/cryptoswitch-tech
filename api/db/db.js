var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require("pg-promise")(/*options*/);
var connectionString = "postgres://gct:gct@localhost:5432/gct";
var db = pgp(connectionString);

// add query functions

module.exports = {
    getHistoricalData: getHistoricalData,
    getLastCandle: getLastCandle,
    getHistoricalOrders: getHistoricalOrders,
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
 order by tt.ts desc`)
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
    db.any('select * from candle order by timestamp desc limit 1500')
        .then(function (data) {
            var candles = [];
            for (let i = 0; i < data.length; i++) {
                candles.push([
                    Date.parse(data[i].timestamp),
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
select *
from trade_history
where ts > timezone('utc', now()) - interval '48 hours'
   and status = 'FILLED'
   and strategy = 'ALPHA'
order by ts asc
`)
        .then(function (data) {
            var orders = [];
            for (let i = 0; i < data.length; i++) {
                orders.push([
                    Date.parse(data[i].ts),
                    data[i].side,
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
