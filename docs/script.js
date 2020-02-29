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

function fuzz(what) {
  if (what === null) {
    return null
  }
  if (typeof what === "boolean") {
    return rndBool()
  }
  if (typeof what === "number") {
    if (Math.floor(what) === what) { // int
      if (Math.abs(what) <= 128) {
        return rndInt8()
      }
      if (what >= 0 && what < 256) {
        return rndInt8() + 128
      }
      return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    }
    if (what >= 0 && what <= 1) {
      return Math.random()
    }
    return Math.random() * Number.MAX_VALUE
  }
  if (typeof what === "string") {
    var chars = what || "."
    return repeat(
      () => { return chars.charAt(Math.floor(Math.random() * chars.length)) },
      what.length * (Math.random() + 0.5))
    .join("")
  }
  if (Object.prototype.toString.call(what) === "[object Array]") {
    return repeat((i) => {
      return fuzz(what[i % what.length])
    }, what.length * (Math.random() + 0.5))
  }
  if (typeof what === "object") {
    var obj = {};
    for (var key in what) {
      // keep key
      obj[key] = fuzz(what[key])
    }
    return obj
  }
  if (typeof what === "function") {
    return fuzz(what())
  }
  return what
}

function repeat(fn, num) {
  num = num || 10
  var res = [];
  for (var i = 0; i < num; i++) {
    res.push(fn(i))
  }
  return res
}

function rndInt8() {
  return Math.floor((Math.random() - 0.5) * 255)
}

function rndBool() {
  return Math.random() < 0.5
}

function byteLength(str) {
  return (new TextEncoder().encode(str)).length
}

function original(input) {
  return {
    name: "Original input",
    length: byteLength(input),
    contents: input,
    gzLength: pako.gzip(input).length,
    notes: ""
  }
}

function formattedJson(input) {
  var output = JSON.stringify(JSON.parse(input), null, 2)
  return {
    name: "Formatted JSON",
    length: byteLength(output),
    contents: output,
    gzLength: pako.gzip(output).length,
    notes: ""
  }
}

function json(input) {
  var output = JSON.stringify(JSON.parse(input))  
  return {
    name: "JSON",
    length: byteLength(output),
    contents: output,
    gzLength: pako.gzip(output).length,
    notes: ""
  }
}

function cbor(input) {
  var output = CBOR.encode(JSON.parse(input))
  return {
    name: "CBOR",
    length: output.byteLength,
    contents: output,
    gzLength: pako.gzip(output).length,
    notes: "Implementation doesn't distinguish between float and double"
  }
}

function bson(input) {
  var output = (new BSON()).serialize(JSON.parse(input))
  return {
    name: "BSON",
    length: output.length,
    contents: output,
    gzLength: pako.gzip(output).length,
    notes: ""
  }
}

function msgPack(input) {
  var output = msgpack.encode(JSON.parse(input))
  return {
    name: "MessagePack",
    length: output.length,
    contents: output,
    gzLength: pako.gzip(output).length,
    notes: "Implementation doesn't distinguish between float and double"
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
  resultsEl.innerHTML = `<tr><td>Name</td><td>Size</td><td>After gzip</td><td>Notes</td></tr>`

  for (var fn of [json, original, formattedJson, cbor, bson, msgPack]) {
    var result = fn(text)
    var el = document.createElement("tr")
    if (fn == baseLineFn) {
      el.style.backgroundColor = "#ddd"
    }
    el.innerHTML = `<td>${result.name}</td>
      <td>${result.length} bytes</td>
      <td>${result.gzLength} bytes</td>
      <td>${result.notes}</td>` 
    resultsEl.appendChild(el)
  }
}

document.getElementById("sampleinput").click()
