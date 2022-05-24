export { INPUT_STRING } from './common.js';

// Encrypted with a hardcoded keypair (in encryption-keys.ts)
export const ENCRYPTED_HEX =
    'c4b896a873616c747061636b92020000c4205bf55c73b82ebe22be80f3430667' +
    'af570fae2556a6415e6b30d4065300aa947dc43094992d83ef6d054728b19b77' +
    'f91640d4b6fc921440138f7d571fb1796e44fd8f780f153e4507d3ed7f500b48' +
    'b6e752df9192c42060346e7c911a5f6ba154129174cafe75b294ac3bbd554963' +
    '2f48cec6266f8410c4302159708fbf1824787d5872df43734dd567672f70eab9' +
    '663ef62165ca5653e24de796b9f2951c87971d4c23a649984dc693c391c42020' +
    '755fe80a6ccb4486993bf69cc8f5050f26ec8850fb776fca4ce22ef665f056c4' +
    'c64d6cbc4477493be11cb91110ead53afd99f227025700b3d93f6fea2f2bcd90' +
    '5c170488bbb342b33fad6c3b8037e787d7f310a6a4240bfaca5ba3867e42a685' +
    'a0de9eb12c5c7d51b13749c5e7607e5ab187b584e0bc35ac6a9b17e3a1bd717f' +
    'b4f7c6ffad48afad5fa1d44faef31554c2fce0f2dbc6a215761eb10e664bd353' +
    '156eb13da776b51c049d1ead133542cbdf8b5ffb124bbe82184bce9c0d9da611' +
    '0e47f69a40d3c365f9c2e3fc4178ac36deadd61bbc0817a8cf7cf5bf944c228b' +
    'e675888b05c84e';

export const ENCRYPTED = Buffer.from(ENCRYPTED_HEX, 'hex');
