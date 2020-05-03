type Raw = ArrayBuffer | string;

enum RawType {
  String = 'String',
  ArrayBuffer = 'ArrayBuffer',
}

interface IStringBytes {
  raw: Raw;
  type: RawType;
  useTextEncoder: boolean;
  useTextDecoder: boolean;
  toArrayBuffer: () => ArrayBuffer;
  toString: () => string;
}

function getRawType(raw: Raw): RawType {
  if (typeof raw === 'string') {
    return RawType.String;
  }

  if (raw instanceof ArrayBuffer) {
    return RawType.ArrayBuffer;
  }

  throw new Error(`Unable to initialize StringBytes with value of type ${typeof raw}\n
    valid values are either a "string" or an "ArrayBuffer" instance.`);
}

function StringBytes(raw: Raw) {
  this.raw = raw;
  this.type = getRawType(raw);
  this.useTextEncoder = true;
  this.useTextDecoder = true;

  if (!('TextEncoder' in window)) {
    this.useTextEncoder = false;
    console.warn('TextEncoder is not available in this browser.');
  }

  if (!('TextDecoder' in window)) {
    this.useTextDecoder = false;
    console.warn('TextDecoder is not available in this browser.');
  }
};

StringBytes.prototype.toArrayBuffer = function() {
  if (this.type !== RawType.String) {
    throw new Error(`Unable to create an ArrayBuffer from ${this.type}`);
  }

  if (this.useTextEncoder) {
    const encoder = new TextEncoder();
    const uint8Arr = encoder.encode(this.raw);

    return uint8Arr.buffer;
  }

  const raw = String.raw`${this.raw}`; // use raw to avoid expanding escape chars
  const buff = new ArrayBuffer(raw.length * 2); // 2 bytes per character
  const strLen = raw.length;
  const buffView = new Uint16Array(buff);

  let i = 0;

  for (i; i < strLen; i++) {
    buffView[i] = raw.charCodeAt(i);
  }

  return buff;
}

StringBytes.prototype.toString = function() {
  if (this.type !== RawType.ArrayBuffer) {
    throw new Error(`Unable to create a string from ${this.type}`);
  }

  if (this.useTextDecoder) {
    const decoder = new TextDecoder('utf-8');
    
    return decoder.decode(this.raw);
  }

  return String.fromCharCode.apply(null, new Uint16Array(this.raw));
}

export default StringBytes as any as { new (raw: Raw): IStringBytes; };
