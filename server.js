const express = require('express')
var config = require('./config/index')
//端口
var port = process.env.PORT || 9898
console.log(port)
var app = express()

var router = express.Router()

router.get('/', (req, res, next) => {
  req.url = '/index.html'
  next()
})

app.use(router)

var appData = require('./data.json')
var seller = appData.seller
var goods = appData.goods
var ratings = appData.ratings

var apiRoutes = express.Router()
apiRoutes.get('/seller', function (req, res) {
  res.json({
    errno: 0,
    data: seller
  });
});

apiRoutes.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  });
});

apiRoutes.get('/ratings', function (req, res) {
  res.json({
    errno: 0,
    data: ratings
  });
});

app.use('/api', apiRoutes);
//定义静态文件目录
app.use(express.static('./dist'));
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
});