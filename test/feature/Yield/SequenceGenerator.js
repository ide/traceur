function sequenceGenerator() {
  var i = 1;
  yield i;
  i = 3;
  yield i + 1;
  {
    var x = 3;
    yield i + x;
    yield x;
  }
}

function accumulate(iterator) {
  var result = '';
  for (var value : iterator) {
    result = result + String(value);
  }
  return result;
}

// ----------------------------------------------------------------------------

assertEquals('1463', accumulate(sequenceGenerator()));
