import WC from "../circuit_js/witness_calculator.esm.js";

//const bGenProof = document.getElementById("bGenProof");
//bGenProof.addEventListener("click", calculateProof);
let wasm, zkeyBuffer, vKey;

async function fetchBuffer(uri) {
  const resp = await fetch(uri);
  return resp.arrayBuffer();
}

async function getWitnessCalculator() {
  if (!wasm) {
    vKey = await (await fetch("../circuit_js/verification_key.json")).json();

    const buffer = await fetchBuffer("../circuit_js/circuit.wasm");
    zkeyBuffer = await fetchBuffer("../circuit_js/circuit_final.zkey");
    wasm = await WC(new Uint8Array(buffer));
  }
  return wasm;
}

async function verifyProof({ proof, publicSignals }) {
  try {
    await getWitnessCalculator();
    //console.log(proof, publicSignals)
    const res = await snarkjs.plonk.verify(vKey, publicSignals, proof);
    return res === true;
  } catch (err) {
    return false;
  }
}

async function generateProof(a, b) {
  const inputs = {
    a: a,
    b: b,
    d: 1,
  };
  const wc = await getWitnessCalculator();
  const wtns = await wc.calculateWTNSBin(inputs, 0);
  return snarkjs.plonk.prove(new Uint8Array(zkeyBuffer), wtns);
}


export async function calculateProof(a,b) {
  //console.log('Loading...')
  await loadJS("/javascripts/snarkjs.min.js");
  //console.log('Loaded!', window.snarkjs)

  const { proof, publicSignals } = await generateProof(a, b);

  const res = await verifyProof({ proof, publicSignals });
  return { proof: {proof, publicSignals}, verify: res }

}

function loadJS(uri) {
  return new Promise((resolve, reject) => {
    const noop = () => {};
    const scriptTag = document.createElement("script");
    scriptTag.onload = () => {
      scriptTag.onerror = noop;
      scriptTag.onload = noop;
      resolve();
    };
    scriptTag.onerror = (ev) => {
      scriptTag.onerror = noop;
      scriptTag.onload = noop;
      reject(ev);
    };
    scriptTag.src = uri;
    document.body.appendChild(scriptTag);
  });
}
