pragma circom 2.0.0;

template IsZero() {
    signal input a;
    signal input b;
    signal input d;
    signal output c;
    c <== a-b*d;
 }

 component main = IsZero();
