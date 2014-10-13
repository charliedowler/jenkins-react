var jenkinsapi = require('jenkins-api');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('app');
});

router.get('/logout', function (req, res) {
  delete req.session.user;
  res.redirect('/');
});

router.post('/login', function (req, res) {
  var user = req.body.username;
  var pass = req.body.password;
  var root = req.body.root;
  var jenkins = jenkinsapi.init('http://' + user + ':' + pass + '@' + root);
  jenkins.all_jobs(function (err, data) {
    if (err) {
      res.send(err, 500)
    }
    if (data === true) res.send(401);
    else {
      req.session.user = {
        name: user,
        pass: pass,
        root: root
      };
      res.send(data, 200);
    }
  });
});

router.get('/queue', function (req, res) {
  var user = getData(req);
  if (!user) {
    res.send(401);
    return false;
  }
  var jenkins = jenkinsapi.init('http://' + user.name + ':' + user.pass + '@' + user.root);
  jenkins.queue(function (err, data) {
    if (err) {
      res.send(err, 500);
    }
    if (data === true) res.send(401);
    else {
      res.send(data, 200);
    }
  });
});

router.get('/all_jobs', function (req, res) {
  var user = getData(req);
  if (!user) {
    res.send(401);
    return false;
  }
  var jenkins = jenkinsapi.init('http://' + user.name + ':' + user.pass + '@' + user.root);

  jenkins.all_jobs(function (err, data) {
    if (err) {
      res.send(err, 500);
    }
    if (data === true) res.send(401);
    else {
      res.send(data, 200);
    }
  });
});

router.get('/job_info', function (req, res) {
  var user = getData(req);
  if (!user) {
    res.send(401);
    return false;
  }
  var jenkins = jenkinsapi.init('http://' + user.name + ':' + user.pass + '@' + user.root);
  jenkins.job_info(req.param('job'), function (err, data) {
    if (err) {
      res.send(err, 500);
    }
    if (data === true) res.send(401);
    else {
      res.send(data, 200);
    }
  });
});

router.get('/build_info', function (req, res) {
  var user = getData(req);
  if (!user) {
    res.send(401);
    return false;
  }
  var jenkins = jenkinsapi.init('http://' + user.name + ':' + user.pass + '@' + user.root);
  jenkins.build_info(req.param('job'), req.param('build_number'), function (err, data) {
    if (err) {
      res.send(err, 500);
    }
    if (data === true) res.send(401);
    else {
      res.send(data, 200);
    }
  });
});

function getData(req) {
  if (!req.session.user) return false;
  return {
    name: req.session.user.name,
    pass: req.session.user.pass,
    root: req.session.user.root
  }
}

module.exports = router;
