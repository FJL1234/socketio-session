var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.num = req.session.num || 0;
  const num = ++req.session.num;
  res.render('index', { title: 'Express',num });
});

router.get("/ajax",function (req,res) {
  console.log("111");
  req.session.num = req.session.num || 0;
  const num = ++req.session.num;
  res.send("num = " + num);
})

module.exports = router;
