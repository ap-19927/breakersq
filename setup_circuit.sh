cd circuit
circom circuit.circom --r1cs --wasm --sym
snarkjs r1cs info circuit.r1cs
snarkjs r1cs print circuit.r1cs circuit.sym
snarkjs r1cs export json circuit.r1cs circuit.r1cs.json
cat circuit.r1cs.json
snarkjs plonk setup circuit.r1cs pot12_final.ptau circuit_final.zkey
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json
mv circuit_js/circuit.wasm ../public/circuit_js
sed -i 's/module.exports =/export default/g' circuit_js/witness_calculator.js
mv circuit_js/witness_calculator.js ../public/circuit_js/witness_calculator.esm.js
mv circuit_final.zkey ../public/circuit_js
mv verification_key.json ../public/circuit_js
