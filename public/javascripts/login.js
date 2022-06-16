jQuery("#formLogin").submit(async function (event) {

  event.preventDefault();
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200)
          redirect('');
  };
  xhr.open("POST", '/login');
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  const key = document.getElementById("k").value;

  async function* makeTextFileLineIterator(fileURL) { //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#processing_a_text_file_line_by_line
    const utf8Decoder = new TextDecoder('utf-8');
    const response = await fetch(fileURL);
    const reader = response.body.getReader();
    let { value: chunk, done: readerDone } = await reader.read();
    chunk = chunk ? utf8Decoder.decode(chunk) : '';

    const re = /\n|\r|\r\n/gm;
    let startIndex = 0;
    let result;

    for (;;) {
      let result = re.exec(chunk);
      if (!result) {
        if (readerDone) {
          break;
        }
        let remainder = chunk.substr(startIndex);
        ({ value: chunk, done: readerDone } = await reader.read());
        chunk = remainder + (chunk ? utf8Decoder.decode(chunk) : '');
        startIndex = re.lastIndex = 0;
        continue;
      }
      yield chunk.substring(startIndex, result.index);
      startIndex = re.lastIndex;
    }
    if (startIndex < chunk.length) {
      // last line didn't end in a newline char
      yield chunk.substr(startIndex);
    }
  }

  const publicKey = await gen(hexStringToTypedArray(key)).then(s => {
    return s.public.publicKey;
  });
  async function run() {
    for await (let line of makeTextFileLineIterator('./verify.txt')) {
      if(publicKey==line) {
        const circuit = await calculateProof(publicKey,line).then(c => {return c})
        if(circuit.verify) return circuit
      }
    }
  }
  run()
  .then( b => {
    if(b) {
        const jsn = JSON.stringify(b.proof);
        xhr.send(jsn);
    }
    else{
      document.getElementById("invalid").innerHTML = "Invalid key.\r";
      xhr.send(JSON.stringify({proof: undefined, publicSignals: undefined}));
    }
  });



});

//https://stackoverflow.com/questions/32084571/why-is-an-object-in-an-xmlhttprequest-sent-to-a-node-express-server-empty?noredirect=1&lq=1
//https://stackoverflow.com/questions/42942176/what-callback-function-should-i-use-in-an-xmlhttprequest-to-render-the-response
