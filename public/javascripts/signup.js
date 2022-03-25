jQuery("#formReg").submit(function (event) {
  event.preventDefault();
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200)
          setTimeout(() => {redirect('login');}, 5000*6);
  }
  xhr.open("POST", '/signup')
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

  gen(crypto.getRandomValues(new Uint32Array(16))).then(s => {
    const jsn = JSON.stringify(s.public)
    xhr.send(jsn)
    document.getElementById("pubInit").innerHTML = "This is your public key.\r";
    document.getElementById("pubKey").innerHTML = s.public.publicKey;
    document.getElementById("init").innerHTML = "This is your private key. Keep it secret. Keep it safe. Page expires in 30 seconds.\r";
    document.getElementById("key").innerHTML = s.key;
  });
});

//https://stackoverflow.com/questions/32084571/why-is-an-object-in-an-xmlhttprequest-sent-to-a-node-express-server-empty?noredirect=1&lq=1
//https://stackoverflow.com/questions/42942176/what-callback-function-should-i-use-in-an-xmlhttprequest-to-render-the-response
