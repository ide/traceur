function simpleGenerator() {
  yield 1;
}

function accumulate(iterator) {
  var result = '';
  for (var value : iterator) {
    result = result + String(value);
  }
  return result;
}

// ----------------------------------------------------------------------------

assertEquals('1', accumulate(simpleGenerator()));
