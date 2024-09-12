export interface Addresses {
  Address?: string;
}

export function encodeAddresses(message: Addresses): Uint8Array {
  let bb = popByteBuffer();
  _encodeAddresses(message, bb);
  return toUint8Array(bb);
}

function _encodeAddresses(message: Addresses, bb: ByteBuffer): void {
  // optional string Address = 1;
  let $Address = message.Address;
  if ($Address !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $Address);
  }
}

export function decodeAddresses(binary: Uint8Array): Addresses {
  return _decodeAddresses(wrapByteBuffer(binary));
}

function _decodeAddresses(bb: ByteBuffer): Addresses {
  let message: Addresses = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string Address = 1;
      case 1: {
        message.Address = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface LoginRequest {
  Email?: string;
  Password?: string;
}

export function encodeLoginRequest(message: LoginRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeLoginRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeLoginRequest(message: LoginRequest, bb: ByteBuffer): void {
  // optional string Email = 1;
  let $Email = message.Email;
  if ($Email !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $Email);
  }

  // optional string Password = 2;
  let $Password = message.Password;
  if ($Password !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $Password);
  }
}

export function decodeLoginRequest(binary: Uint8Array): LoginRequest {
  return _decodeLoginRequest(wrapByteBuffer(binary));
}

function _decodeLoginRequest(bb: ByteBuffer): LoginRequest {
  let message: LoginRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string Email = 1;
      case 1: {
        message.Email = readString(bb, readVarint32(bb));
        break;
      }

      // optional string Password = 2;
      case 2: {
        message.Password = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface LogoutRequest {
  Token?: string;
}

export function encodeLogoutRequest(message: LogoutRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeLogoutRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeLogoutRequest(message: LogoutRequest, bb: ByteBuffer): void {
  // optional string Token = 1;
  let $Token = message.Token;
  if ($Token !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $Token);
  }
}

export function decodeLogoutRequest(binary: Uint8Array): LogoutRequest {
  return _decodeLogoutRequest(wrapByteBuffer(binary));
}

function _decodeLogoutRequest(bb: ByteBuffer): LogoutRequest {
  let message: LogoutRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string Token = 1;
      case 1: {
        message.Token = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface LogoutResponse {
  Success?: boolean;
}

export function encodeLogoutResponse(message: LogoutResponse): Uint8Array {
  let bb = popByteBuffer();
  _encodeLogoutResponse(message, bb);
  return toUint8Array(bb);
}

function _encodeLogoutResponse(message: LogoutResponse, bb: ByteBuffer): void {
  // optional bool Success = 1;
  let $Success = message.Success;
  if ($Success !== undefined) {
    writeVarint32(bb, 8);
    writeByte(bb, $Success ? 1 : 0);
  }
}

export function decodeLogoutResponse(binary: Uint8Array): LogoutResponse {
  return _decodeLogoutResponse(wrapByteBuffer(binary));
}

function _decodeLogoutResponse(bb: ByteBuffer): LogoutResponse {
  let message: LogoutResponse = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional bool Success = 1;
      case 1: {
        message.Success = !!readByte(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface GetAllUsersRequest {
}

export function encodeGetAllUsersRequest(message: GetAllUsersRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeGetAllUsersRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeGetAllUsersRequest(message: GetAllUsersRequest, bb: ByteBuffer): void {
}

export function decodeGetAllUsersRequest(binary: Uint8Array): GetAllUsersRequest {
  return _decodeGetAllUsersRequest(wrapByteBuffer(binary));
}

function _decodeGetAllUsersRequest(bb: ByteBuffer): GetAllUsersRequest {
  let message: GetAllUsersRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface GetAllUsersResponse {
  Users?: User[];
}

export function encodeGetAllUsersResponse(message: GetAllUsersResponse): Uint8Array {
  let bb = popByteBuffer();
  _encodeGetAllUsersResponse(message, bb);
  return toUint8Array(bb);
}

function _encodeGetAllUsersResponse(message: GetAllUsersResponse, bb: ByteBuffer): void {
  // repeated User Users = 1;
  let array$Users = message.Users;
  if (array$Users !== undefined) {
    for (let value of array$Users) {
      writeVarint32(bb, 10);
      let nested = popByteBuffer();
      _encodeUser(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
}

export function decodeGetAllUsersResponse(binary: Uint8Array): GetAllUsersResponse {
  return _decodeGetAllUsersResponse(wrapByteBuffer(binary));
}

function _decodeGetAllUsersResponse(bb: ByteBuffer): GetAllUsersResponse {
  let message: GetAllUsersResponse = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated User Users = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        let values = message.Users || (message.Users = []);
        values.push(_decodeUser(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface User {
  ID?: string;
  Fullname?: string;
  Email?: string;
  Password?: string;
  Role?: number;
  CreatedAt?: google.protobuf.Timestamp;
  Addresses?: Addresses[];
  Children?: ChildrenList;
}

export function encodeUser(message: User): Uint8Array {
  let bb = popByteBuffer();
  _encodeUser(message, bb);
  return toUint8Array(bb);
}

function _encodeUser(message: User, bb: ByteBuffer): void {
  // optional string ID = 1;
  let $ID = message.ID;
  if ($ID !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $ID);
  }

  // optional string Fullname = 2;
  let $Fullname = message.Fullname;
  if ($Fullname !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $Fullname);
  }

  // optional string Email = 3;
  let $Email = message.Email;
  if ($Email !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $Email);
  }

  // optional string Password = 4;
  let $Password = message.Password;
  if ($Password !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $Password);
  }

  // optional int32 Role = 5;
  let $Role = message.Role;
  if ($Role !== undefined) {
    writeVarint32(bb, 40);
    writeVarint64(bb, intToLong($Role));
  }

  // optional google.protobuf.Timestamp CreatedAt = 6;
  let $CreatedAt = message.CreatedAt;
  if ($CreatedAt !== undefined) {
    writeVarint32(bb, 50);
    let nested = popByteBuffer();
    _encodegoogle.protobuf.Timestamp($CreatedAt, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated Addresses Addresses = 7;
  let array$Addresses = message.Addresses;
  if (array$Addresses !== undefined) {
    for (let value of array$Addresses) {
      writeVarint32(bb, 58);
      let nested = popByteBuffer();
      _encodeAddresses(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional ChildrenList Children = 8;
  let $Children = message.Children;
  if ($Children !== undefined) {
    writeVarint32(bb, 66);
    let nested = popByteBuffer();
    _encodeChildrenList($Children, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
}

export function decodeUser(binary: Uint8Array): User {
  return _decodeUser(wrapByteBuffer(binary));
}

function _decodeUser(bb: ByteBuffer): User {
  let message: User = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string ID = 1;
      case 1: {
        message.ID = readString(bb, readVarint32(bb));
        break;
      }

      // optional string Fullname = 2;
      case 2: {
        message.Fullname = readString(bb, readVarint32(bb));
        break;
      }

      // optional string Email = 3;
      case 3: {
        message.Email = readString(bb, readVarint32(bb));
        break;
      }

      // optional string Password = 4;
      case 4: {
        message.Password = readString(bb, readVarint32(bb));
        break;
      }

      // optional int32 Role = 5;
      case 5: {
        message.Role = readVarint32(bb);
        break;
      }

      // optional google.protobuf.Timestamp CreatedAt = 6;
      case 6: {
        let limit = pushTemporaryLength(bb);
        message.CreatedAt = _decodegoogle.protobuf.Timestamp(bb);
        bb.limit = limit;
        break;
      }

      // repeated Addresses Addresses = 7;
      case 7: {
        let limit = pushTemporaryLength(bb);
        let values = message.Addresses || (message.Addresses = []);
        values.push(_decodeAddresses(bb));
        bb.limit = limit;
        break;
      }

      // optional ChildrenList Children = 8;
      case 8: {
        let limit = pushTemporaryLength(bb);
        message.Children = _decodeChildrenList(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ChildrenList {
  Children?: string[];
}

export function encodeChildrenList(message: ChildrenList): Uint8Array {
  let bb = popByteBuffer();
  _encodeChildrenList(message, bb);
  return toUint8Array(bb);
}

function _encodeChildrenList(message: ChildrenList, bb: ByteBuffer): void {
  // repeated string Children = 1;
  let array$Children = message.Children;
  if (array$Children !== undefined) {
    for (let value of array$Children) {
      writeVarint32(bb, 10);
      writeString(bb, value);
    }
  }
}

export function decodeChildrenList(binary: Uint8Array): ChildrenList {
  return _decodeChildrenList(wrapByteBuffer(binary));
}

function _decodeChildrenList(bb: ByteBuffer): ChildrenList {
  let message: ChildrenList = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated string Children = 1;
      case 1: {
        let values = message.Children || (message.Children = []);
        values.push(readString(bb, readVarint32(bb)));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface LoginResponse {
  Token?: string;
}

export function encodeLoginResponse(message: LoginResponse): Uint8Array {
  let bb = popByteBuffer();
  _encodeLoginResponse(message, bb);
  return toUint8Array(bb);
}

function _encodeLoginResponse(message: LoginResponse, bb: ByteBuffer): void {
  // optional string Token = 1;
  let $Token = message.Token;
  if ($Token !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $Token);
  }
}

export function decodeLoginResponse(binary: Uint8Array): LoginResponse {
  return _decodeLoginResponse(wrapByteBuffer(binary));
}

function _decodeLoginResponse(bb: ByteBuffer): LoginResponse {
  let message: LoginResponse = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string Token = 1;
      case 1: {
        message.Token = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface Long {
  low: number;
  high: number;
  unsigned: boolean;
}

interface ByteBuffer {
  bytes: Uint8Array;
  offset: number;
  limit: number;
}

function pushTemporaryLength(bb: ByteBuffer): number {
  let length = readVarint32(bb);
  let limit = bb.limit;
  bb.limit = bb.offset + length;
  return limit;
}

function skipUnknownField(bb: ByteBuffer, type: number): void {
  switch (type) {
    case 0: while (readByte(bb) & 0x80) { } break;
    case 2: skip(bb, readVarint32(bb)); break;
    case 5: skip(bb, 4); break;
    case 1: skip(bb, 8); break;
    default: throw new Error("Unimplemented type: " + type);
  }
}

function stringToLong(value: string): Long {
  return {
    low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),
    high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),
    unsigned: false,
  };
}

function longToString(value: Long): string {
  let low = value.low;
  let high = value.high;
  return String.fromCharCode(
    low & 0xFFFF,
    low >>> 16,
    high & 0xFFFF,
    high >>> 16);
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

let f32 = new Float32Array(1);
let f32_u8 = new Uint8Array(f32.buffer);

let f64 = new Float64Array(1);
let f64_u8 = new Uint8Array(f64.buffer);

function intToLong(value: number): Long {
  value |= 0;
  return {
    low: value,
    high: value >> 31,
    unsigned: value >= 0,
  };
}

let bbStack: ByteBuffer[] = [];

function popByteBuffer(): ByteBuffer {
  const bb = bbStack.pop();
  if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 };
  bb.offset = bb.limit = 0;
  return bb;
}

function pushByteBuffer(bb: ByteBuffer): void {
  bbStack.push(bb);
}

function wrapByteBuffer(bytes: Uint8Array): ByteBuffer {
  return { bytes, offset: 0, limit: bytes.length };
}

function toUint8Array(bb: ByteBuffer): Uint8Array {
  let bytes = bb.bytes;
  let limit = bb.limit;
  return bytes.length === limit ? bytes : bytes.subarray(0, limit);
}

function skip(bb: ByteBuffer, offset: number): void {
  if (bb.offset + offset > bb.limit) {
    throw new Error('Skip past limit');
  }
  bb.offset += offset;
}

function isAtEnd(bb: ByteBuffer): boolean {
  return bb.offset >= bb.limit;
}

function grow(bb: ByteBuffer, count: number): number {
  let bytes = bb.bytes;
  let offset = bb.offset;
  let limit = bb.limit;
  let finalOffset = offset + count;
  if (finalOffset > bytes.length) {
    let newBytes = new Uint8Array(finalOffset * 2);
    newBytes.set(bytes);
    bb.bytes = newBytes;
  }
  bb.offset = finalOffset;
  if (finalOffset > limit) {
    bb.limit = finalOffset;
  }
  return offset;
}

function advance(bb: ByteBuffer, count: number): number {
  let offset = bb.offset;
  if (offset + count > bb.limit) {
    throw new Error('Read past limit');
  }
  bb.offset += count;
  return offset;
}

function readBytes(bb: ByteBuffer, count: number): Uint8Array {
  let offset = advance(bb, count);
  return bb.bytes.subarray(offset, offset + count);
}

function writeBytes(bb: ByteBuffer, buffer: Uint8Array): void {
  let offset = grow(bb, buffer.length);
  bb.bytes.set(buffer, offset);
}

function readString(bb: ByteBuffer, count: number): string {
  // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
  let offset = advance(bb, count);
  let fromCharCode = String.fromCharCode;
  let bytes = bb.bytes;
  let invalid = '\uFFFD';
  let text = '';

  for (let i = 0; i < count; i++) {
    let c1 = bytes[i + offset], c2: number, c3: number, c4: number, c: number;

    // 1 byte
    if ((c1 & 0x80) === 0) {
      text += fromCharCode(c1);
    }

    // 2 bytes
    else if ((c1 & 0xE0) === 0xC0) {
      if (i + 1 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        if ((c2 & 0xC0) !== 0x80) text += invalid;
        else {
          c = ((c1 & 0x1F) << 6) | (c2 & 0x3F);
          if (c < 0x80) text += invalid;
          else {
            text += fromCharCode(c);
            i++;
          }
        }
      }
    }

    // 3 bytes
    else if ((c1 & 0xF0) == 0xE0) {
      if (i + 2 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        if (((c2 | (c3 << 8)) & 0xC0C0) !== 0x8080) text += invalid;
        else {
          c = ((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
          if (c < 0x0800 || (c >= 0xD800 && c <= 0xDFFF)) text += invalid;
          else {
            text += fromCharCode(c);
            i += 2;
          }
        }
      }
    }

    // 4 bytes
    else if ((c1 & 0xF8) == 0xF0) {
      if (i + 3 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        c4 = bytes[i + offset + 3];
        if (((c2 | (c3 << 8) | (c4 << 16)) & 0xC0C0C0) !== 0x808080) text += invalid;
        else {
          c = ((c1 & 0x07) << 0x12) | ((c2 & 0x3F) << 0x0C) | ((c3 & 0x3F) << 0x06) | (c4 & 0x3F);
          if (c < 0x10000 || c > 0x10FFFF) text += invalid;
          else {
            c -= 0x10000;
            text += fromCharCode((c >> 10) + 0xD800, (c & 0x3FF) + 0xDC00);
            i += 3;
          }
        }
      }
    }

    else text += invalid;
  }

  return text;
}

function writeString(bb: ByteBuffer, text: string): void {
  // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8
  let n = text.length;
  let byteCount = 0;

  // Write the byte count first
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }
  writeVarint32(bb, byteCount);

  let offset = grow(bb, byteCount);
  let bytes = bb.bytes;

  // Then write the bytes
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    if (c < 0x80) {
      bytes[offset++] = c;
    } else {
      if (c < 0x800) {
        bytes[offset++] = ((c >> 6) & 0x1F) | 0xC0;
      } else {
        if (c < 0x10000) {
          bytes[offset++] = ((c >> 12) & 0x0F) | 0xE0;
        } else {
          bytes[offset++] = ((c >> 18) & 0x07) | 0xF0;
          bytes[offset++] = ((c >> 12) & 0x3F) | 0x80;
        }
        bytes[offset++] = ((c >> 6) & 0x3F) | 0x80;
      }
      bytes[offset++] = (c & 0x3F) | 0x80;
    }
  }
}

function writeByteBuffer(bb: ByteBuffer, buffer: ByteBuffer): void {
  let offset = grow(bb, buffer.limit);
  let from = bb.bytes;
  let to = buffer.bytes;

  // This for loop is much faster than subarray+set on V8
  for (let i = 0, n = buffer.limit; i < n; i++) {
    from[i + offset] = to[i];
  }
}

function readByte(bb: ByteBuffer): number {
  return bb.bytes[advance(bb, 1)];
}

function writeByte(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 1);
  bb.bytes[offset] = value;
}

function readFloat(bb: ByteBuffer): number {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f32_u8[0] = bytes[offset++];
  f32_u8[1] = bytes[offset++];
  f32_u8[2] = bytes[offset++];
  f32_u8[3] = bytes[offset++];
  return f32[0];
}

function writeFloat(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  f32[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f32_u8[0];
  bytes[offset++] = f32_u8[1];
  bytes[offset++] = f32_u8[2];
  bytes[offset++] = f32_u8[3];
}

function readDouble(bb: ByteBuffer): number {
  let offset = advance(bb, 8);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f64_u8[0] = bytes[offset++];
  f64_u8[1] = bytes[offset++];
  f64_u8[2] = bytes[offset++];
  f64_u8[3] = bytes[offset++];
  f64_u8[4] = bytes[offset++];
  f64_u8[5] = bytes[offset++];
  f64_u8[6] = bytes[offset++];
  f64_u8[7] = bytes[offset++];
  return f64[0];
}

function writeDouble(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 8);
  let bytes = bb.bytes;
  f64[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f64_u8[0];
  bytes[offset++] = f64_u8[1];
  bytes[offset++] = f64_u8[2];
  bytes[offset++] = f64_u8[3];
  bytes[offset++] = f64_u8[4];
  bytes[offset++] = f64_u8[5];
  bytes[offset++] = f64_u8[6];
  bytes[offset++] = f64_u8[7];
}

function readInt32(bb: ByteBuffer): number {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  );
}

function writeInt32(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  bytes[offset] = value;
  bytes[offset + 1] = value >> 8;
  bytes[offset + 2] = value >> 16;
  bytes[offset + 3] = value >> 24;
}

function readInt64(bb: ByteBuffer, unsigned: boolean): Long {
  return {
    low: readInt32(bb),
    high: readInt32(bb),
    unsigned,
  };
}

function writeInt64(bb: ByteBuffer, value: Long): void {
  writeInt32(bb, value.low);
  writeInt32(bb, value.high);
}

function readVarint32(bb: ByteBuffer): number {
  let c = 0;
  let value = 0;
  let b: number;
  do {
    b = readByte(bb);
    if (c < 32) value |= (b & 0x7F) << c;
    c += 7;
  } while (b & 0x80);
  return value;
}

function writeVarint32(bb: ByteBuffer, value: number): void {
  value >>>= 0;
  while (value >= 0x80) {
    writeByte(bb, (value & 0x7f) | 0x80);
    value >>>= 7;
  }
  writeByte(bb, value);
}

function readVarint64(bb: ByteBuffer, unsigned: boolean): Long {
  let part0 = 0;
  let part1 = 0;
  let part2 = 0;
  let b: number;

  b = readByte(bb); part0 = (b & 0x7F); if (b & 0x80) {
    b = readByte(bb); part0 |= (b & 0x7F) << 7; if (b & 0x80) {
      b = readByte(bb); part0 |= (b & 0x7F) << 14; if (b & 0x80) {
        b = readByte(bb); part0 |= (b & 0x7F) << 21; if (b & 0x80) {

          b = readByte(bb); part1 = (b & 0x7F); if (b & 0x80) {
            b = readByte(bb); part1 |= (b & 0x7F) << 7; if (b & 0x80) {
              b = readByte(bb); part1 |= (b & 0x7F) << 14; if (b & 0x80) {
                b = readByte(bb); part1 |= (b & 0x7F) << 21; if (b & 0x80) {

                  b = readByte(bb); part2 = (b & 0x7F); if (b & 0x80) {
                    b = readByte(bb); part2 |= (b & 0x7F) << 7;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    low: part0 | (part1 << 28),
    high: (part1 >>> 4) | (part2 << 24),
    unsigned,
  };
}

function writeVarint64(bb: ByteBuffer, value: Long): void {
  let part0 = value.low >>> 0;
  let part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0;
  let part2 = value.high >>> 24;

  // ref: src/google/protobuf/io/coded_stream.cc
  let size =
    part2 === 0 ?
      part1 === 0 ?
        part0 < 1 << 14 ?
          part0 < 1 << 7 ? 1 : 2 :
          part0 < 1 << 21 ? 3 : 4 :
        part1 < 1 << 14 ?
          part1 < 1 << 7 ? 5 : 6 :
          part1 < 1 << 21 ? 7 : 8 :
      part2 < 1 << 7 ? 9 : 10;

  let offset = grow(bb, size);
  let bytes = bb.bytes;

  switch (size) {
    case 10: bytes[offset + 9] = (part2 >>> 7) & 0x01;
    case 9: bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7F;
    case 8: bytes[offset + 7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
    case 7: bytes[offset + 6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
    case 6: bytes[offset + 5] = size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7F;
    case 5: bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7F;
    case 4: bytes[offset + 3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
    case 3: bytes[offset + 2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
    case 2: bytes[offset + 1] = size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7F;
    case 1: bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7F;
  }
}

function readVarint32ZigZag(bb: ByteBuffer): number {
  let value = readVarint32(bb);

  // ref: src/google/protobuf/wire_format_lite.h
  return (value >>> 1) ^ -(value & 1);
}

function writeVarint32ZigZag(bb: ByteBuffer, value: number): void {
  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint32(bb, (value << 1) ^ (value >> 31));
}

function readVarint64ZigZag(bb: ByteBuffer): Long {
  let value = readVarint64(bb, /* unsigned */ false);
  let low = value.low;
  let high = value.high;
  let flip = -(low & 1);

  // ref: src/google/protobuf/wire_format_lite.h
  return {
    low: ((low >>> 1) | (high << 31)) ^ flip,
    high: (high >>> 1) ^ flip,
    unsigned: false,
  };
}

function writeVarint64ZigZag(bb: ByteBuffer, value: Long): void {
  let low = value.low;
  let high = value.high;
  let flip = high >> 31;

  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint64(bb, {
    low: (low << 1) ^ flip,
    high: ((high << 1) | (low >>> 31)) ^ flip,
    unsigned: false,
  });
}
