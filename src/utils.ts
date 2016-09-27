import { BufferDataType, ContextError } from './enums';

export interface ObjectOf<T> {
  [key: string]: T | undefined;
}

export interface FixedFloat32Array<size extends number> extends Float32Array {
  length: size;
}

export interface FixedInt32Array<size extends number> extends Int32Array {
  length: size;
}

export interface FixedArray<T, size extends number> extends Array<T> {
  length: size;
}

export function isCanvas(object: any): object is HTMLCanvasElement {
  return typeof object.getContext === 'function';
}

export function getBufferDataTypeSize(dataType: BufferDataType) {
  switch (dataType) {
    case BufferDataType.Byte:
    case BufferDataType.UnsignedByte:
      return 1;
    case BufferDataType.Short:
    case BufferDataType.UnsignedShort:
      return 2;
    case BufferDataType.Float:
      return 4;
    default:
      throw new TypeError('Invalid data type');
  }
}

export function randomString() {
  return Math.random().toString(36).slice(-5);
}

export function checkContextErrors(gl: WebGLRenderingContext) {
  const errorCode = gl.getError() as ContextError;

  switch (errorCode) {
    case ContextError.NoError:
      break;
    case ContextError.InvalidEnum:
      throw new Error('Invalid enum');
    case ContextError.InvalidValue:
      throw new Error('Invalid value');
    case ContextError.InvalidOperation:
      throw new Error('Invalid operation');
    case ContextError.InvalidFramebufferOperation:
      throw new Error('Invalid framebuffer operation');
    case ContextError.OutOfMemory:
      throw new Error('Out of memory');
    default:
      throw new Error(`Invalid error code: ${errorCode}`);
  }
}

export function createDebugContext(gl: WebGLRenderingContext) {
  const debugl = Object.create(gl);

  for (const key in gl) {
    const fn = gl[key];
    if (typeof fn === 'function') {
      debugl[key] = function () {
        const result = fn.apply(this, arguments);
        checkContextErrors(gl);
        return result;
      };
    }
  }

  return debugl;
}
