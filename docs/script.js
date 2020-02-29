function sampleinput() {
  return {
    "first name": "John",
    "last name": "Smith",
    "age": 25,
    "address": {
      "street address": "21 2nd Street",
      "city": "New York",
      "state": "NY",
      "postal code": "10021"
    },
    "phone numbers": [
      {
        "type": "home",
        "number": "212 555-1234"
      },
      {
        "type": "fax",
        "number": "646 555-4567"
      }
    ],
    "sex": {
      "type": "male"
    }
  }
}

function snowman() {
  return "☃"
}

function repeat(fn, num) {
  num = num || 10
  var res = [];
  for (var i = 0; i < num; i++) {
    res.push(fn())
  }
  return res
}

function rndInt8() {
  return Math.floor((Math.random() - 0.5) * 255)
}

function rndBool() {
  return Math.random() < 0.5
}

function original(input) {
  return {
    name: "Original input",
    length: byteLength(input),
    contents: input,
    gzLength: pako.gzip(input).length
  }
}

function formattedJson(input) {
  var output = JSON.stringify(JSON.parse(input), null, 2)
  return {
    name: "Formatted JSON",
    length: byteLength(output),
    contents: output,
    gzLength: pako.gzip(output).length
  }
}

function byteLength(str) {
  return (new TextEncoder().encode(str)).length
}

function json(input) {
  var output = JSON.stringify(JSON.parse(input))  
  return {
    name: "JSON",
    length: byteLength(output),
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

function genInput(el) {
  document.getElementById("input").value = JSON.stringify(eval(el.value), null, 2)
  compare()
}

function percent(num) {
  return Math.round(num * 10000) / 100
}

function compare() {
  var text = document.getElementById("input").value
  var baseLineFn = json;
  var baseLine = baseLineFn(text)

  var resultsEl = document.getElementById("results");
  resultsEl.innerHTML = `<tr><td>Name</td><td>Size</td><td>% of JSON</td><td>compressed</td><td>compression</td><td>of original</td></tr>`

  for (var fn of [json, original, formattedJson, cbor, bson, msgPack]) {
    var result = fn(text)
    var el = document.createElement("tr")
    if (fn == baseLineFn) {
      el.style.backgroundColor = "#ddd"
    }
    el.innerHTML = `<td>${result.name}</td>
      <td>${result.length} bytes</td>
      <td>${percent(result.length / baseLine.length)}%</td>
      <td>${result.gzLength} bytes</td>
      <td>${percent(result.gzLength / result.length)}%</td>
      <td>${percent(result.gzLength / baseLine.length)}%</td>`
    resultsEl.appendChild(el)
  }
}

document.getElementById("sampleinput").click()
