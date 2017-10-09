var tape = require("tape"),
    d3 = require("../");

tape("d3.lineRange() has the expected defaults", function(test) {
  var l = d3.lineRange();
  test.deepEqual(l.layout(), {height:500,width:1050,margin:{top: 30, right: 80, bottom: 70, left: 100}});
  test.equal(l.duration(), 1000);
  test.deepEqual(l.data(), []);
  test.deepEqual(l.hide(), []);
  test.end();
});

tape("d3.lineRange() has the expected updates", function(test) {
  var l = d3.lineRange();
  var layout = {margin:{top: 100, right: 80, bottom: 100, left: 10},width:1500, height:2000};
  var duration = 1500;
  var data = [[{'est':152600, 'int1':134400, 'int2':170800}]];
  var hide = [0];

  l.layout(layout);
  l.duration(duration);
  l.data(data);
  l.hide(hide);

  test.deepEqual(l.layout(), layout);
  test.equal(l.duration(), duration);
  test.deepEqual(l.data(), data);
  test.deepEqual(l.hide(), hide);
  test.end();
});