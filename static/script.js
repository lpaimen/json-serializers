function int8Ar(num = 1000) {
  var res = [];
  for (var i = 0; i < num; i++) {
    res.push(Math.round((Math.random() - 0.5) * 127))
  }
  return res;
}

function doubleAr(num = 1000) {
  var res = []
  for (var i = 0; i < num; i++) {
    res.push((Math.random() - 0.5) * 2)
  }
  return res
}

function genInput(el) {
  
  document.getElementById("input").value = JSON.stringify(eval(el.value), null, 2)
  compare()
}

function percent(num) {
  return Math.round(num * 10000) / 100
}

function original(input) {
  return {
    name: "Original input",
    length: input.length,
    contents: input,
    gzLength: pako.gzip(input).length
  }
}

function formattedJson(input) {
  var output = JSON.stringify(JSON.parse(input), null, 2)
  return {
    name: "Formatted JSON",
    length: output.length,
    contents: output,
    gzLength: pako.gzip(output).length
  }
}

function json(input) {
  var output = JSON.stringify(JSON.parse(input))  
  return {
    name: "JSON",
    length: output.length,
    contents: output,
    gzLength: pako.gzip(output).length
  }
}

function cbor(input) {
  var output = CBOR.encode(JSON.parse(input))
  return {
    name: "CBOR",
    length: output.byteLength,
    contents: output,
    gzLength: pako.gzip(output).length
  }
}

function bson(input) {
  var output = (new BSON()).serialize(JSON.parse(input))
  return {
    name: "BSON",
    length: output.length,
    contents: output,
    gzLength: pako.gzip(output).length
  }
}

function msgPack(input) {
  var output = msgpack.encode(JSON.parse(input))
  return {
    name: "MessagePack",
    length: output.length,
    contents: output,
    gzLength: pako.gzip(output).length
  }
}

function compareWith(fn) {
  return (text, parent) => {

    var result = fn(text)

    var el = document.createElement("div");
    el.innerHTML = `<b>${result.name}:</b><br/>
      ${result.length} bytes, ratio ${percent(result.length / text.length)}% of original<br/>
      gzipped: ${result.gzLength} bytes, compression ratio ${percent(result.gzLength / result.length)}%, ${percent(result.gzLength / text.length)}% of original`
    parent.appendChild(el)
  }
}

function compare() {
  var text = document.getElementById("input").value

  var resultsEl = document.getElementById("results");
  resultsEl.innerHTML = `Original: ${text.length} bytes<p>`

  compareWith(original)(text, resultsEl)
  compareWith(json)(text, resultsEl)
  compareWith(formattedJson)(text, resultsEl)
  compareWith(cbor)(text, resultsEl)
  compareWith(bson)(text, resultsEl)
  compareWith(msgPack)(text, resultsEl)
}

compare()