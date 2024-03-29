function doGenerator() {
  var i = 0;
  do {
    if (++i % 2 == 0) continue;
    yield i;
  } while (i < 6);
}

function accumulate(iterator) {
  var result = '';
  for (var value : iterator) {
    result = result + String(value);
  }
  return result;
}

// ----------------------------------------------------------------------------

assertEquals('135', accumulate(doGenerator()));
