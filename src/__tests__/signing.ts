
// @ts-ignore
global.Uint8Array = Buffer.__proto__;

import {sign, verify, SignStream, VerifyStream, signDetached, verifyDetached} from '../signing';
import SignedMessageHeader from '../signing/header';
import * as tweetnacl from 'tweetnacl';

const INPUT_STRING = 'Two roads diverged in a yellow wood, and sorry I could not travel both\n' +
    'and be one traveller, long I stood, and looked down one as far as I\n' +
    'could, to where it bent in the undergrowth.';

// Signed with a hardcoded keypair
    const SIGNATURE_HEADER_HEX = 'c45295a873616c747061636b92020001c4203b6a27bcceb6a42d62a3a8d02a6f' +
    '0d73653215771de243a63ac048a18b59da29c420000000000000000000000000' +
    '0000000000000000000000000000000000000000';
const SIGNED_HEX = 'c45295a873616c747061636b92020001c4203b6a27bcceb6a42d62a3a8d02a6f' +
    '0d73653215771de243a63ac048a18b59da29c420000000000000000000000000' +
    '000000000000000000000000000000000000000093c3c4404a77380837fb4ec6' +
    '2480e76c59b735a6287e85b54afe7793531ff70076c51fc23b1f078e6700b85b' +
    'eb9fc091d69c8826b5268765b7eded317d943fed99bb560fc4b654776f20726f' +
    '61647320646976657267656420696e20612079656c6c6f7720776f6f642c2061' +
    '6e6420736f727279204920636f756c64206e6f742074726176656c20626f7468' +
    '0a616e64206265206f6e652074726176656c6c65722c206c6f6e672049207374' +
    '6f6f642c20616e64206c6f6f6b656420646f776e206f6e652061732066617220' +
    '617320490a636f756c642c20746f2077686572652069742062656e7420696e20' +
    '74686520756e64657267726f7774682e';
const SIGNED = Buffer.from(SIGNED_HEX, 'hex');

const DETACHED_SIGNATURE_HEADER_HEX = 'c45295a873616c747061636b92020002c4203b6a27bcceb6a42d62a3a8d02a6f' +
    '0d73653215771de243a63ac048a18b59da29c420000000000000000000000000' +
    '0000000000000000000000000000000000000000';
const DETACHED_SIGNATURE_HEX = 'c45295a873616c747061636b92020002c4203b6a27bcceb6a42d62a3a8d02a6f' +
    '0d73653215771de243a63ac048a18b59da29c420000000000000000000000000' +
    '0000000000000000000000000000000000000000c4403d452b27bfc69543e20c' +
    'bf3a139fd689450f26e4084660f66090de422f2e438931efd159c9101c99e070' +
    'f3de277330b51940a7583f8c925085b1f86f38693f06';
const DETACHED_SIGNATURE = Buffer.from(DETACHED_SIGNATURE_HEX, 'hex');

const KEYPAIR = tweetnacl.sign.keyPair.fromSecretKey(Buffer.from('00000000000000000000000000000000000000000000000000000000000000003b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29', 'hex'));
SignedMessageHeader.debug_fix_nonce = Buffer.alloc(32).fill('\x00');

test('sign', () => {
    const signed = sign(INPUT_STRING, KEYPAIR);

    expect(signed).toStrictEqual(SIGNED);
});

test('sign stream', async () => {
    const stream = new SignStream(KEYPAIR);
    const result: Buffer[] = [];

    await new Promise((rs, rj) => {
        stream.on('error', rj);
        stream.on('end', rs);
        stream.on('data', chunk => result.push(chunk));

        stream.end(INPUT_STRING);
    });

    expect(Buffer.concat(result)).toStrictEqual(SIGNED);
});

test('verify', async () => {
    const data = await verify(SIGNED, KEYPAIR.publicKey);

    expect(data.toString()).toBe(INPUT_STRING);
});

test('verify stream', async () => {
    const stream = new VerifyStream(KEYPAIR.publicKey);
    const result: Buffer[] = [];

    await new Promise((rs, rj) => {
        stream.on('error', rj);
        stream.on('end', rs);
        stream.on('data', chunk => result.push(chunk));

        stream.end(SIGNED);
    });

    expect(Buffer.concat(result).toString()).toBe(INPUT_STRING);
});

test('verify with wrong public key fails', () => {
    const public_key = new Uint8Array(KEYPAIR.publicKey);
    public_key[0] = 0;

    expect(async () => {
        await verify(SIGNED, public_key);
    }).rejects.toThrow();
});

test('sign detached', () => {
    const signed = signDetached(INPUT_STRING, KEYPAIR);
    expect(signed).toStrictEqual(DETACHED_SIGNATURE);
});

test('verify detached', async () => {
    await verifyDetached(DETACHED_SIGNATURE, INPUT_STRING, KEYPAIR.publicKey);
});

test('verify detached with wrong public key fails', () => {
    const public_key = KEYPAIR.publicKey;
    public_key[0] = 0;

    expect(async () => {
        await verifyDetached(DETACHED_SIGNATURE, INPUT_STRING, public_key);
    }).rejects.toThrow();
});
