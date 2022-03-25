
/**
 * Convert a hex string to an ArrayBuffer.
 *
 * @param {string} hexString - hex representation of bytes
 * @return {ArrayBuffer} - The bytes in an ArrayBuffer.
 https://gist.github.com/don/871170d88cf6b9007f7663fdbc23fe09
 */
function hexStringToTypedArray(hexString) {
    // remove the leading 0x
    hexString = hexString.replace(/^0x/, '');

    // ensure even number of characters
    if (hexString.length % 8 != 0) {
        return new Uint32Array(16)
    }

    // check for some non-hex characters
    var bad = hexString.match(/[G-Z\s]/i);
    if (bad) {
        //console.log('WARNING: found non-hex characters', bad);
        return new Uint32Array(16)
    }

    // split the string into 8-tuples of octets
    var pairs = hexString.match(/[\dA-F]{8}/gi);

    // convert the octets to integers
    var integers = pairs.map(function(s) {
        return parseInt(s, 16);
    });

    var array = new Uint32Array(integers);
    //console.log(array);

    return array;
}
const curve = sjcl.ecc.curves.c384;
const generator = curve.G;

async function sha256(str) { //https://jameshfisher.com/2017/10/30/web-cryptography-api-hello-world/
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(str));
  return '0x'+Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
}


const gen = async (key) => {
  key = sjcl.bn.fromBits(key);
  if(!generator.mult(key).x) {
    return { key: key.toString(16),
            public: {publicKey: undefined},
          }
  }
  const preImage = generator.mult(key).x.limbs.toString(16)+generator.mult(key).y.limbs.toString(16);
  let publicKey = await sha256(preImage)
  .then(result => {
    return result
  });
  key = key.toString(16)
  publicKey = publicKey.toString(16)
  return { key: key.toString(16),
          public: {publicKey: publicKey.toString(16)},
        }
}

function redirect(res){
  window.location = res;
}
