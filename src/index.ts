import Context, { ContextOptions } from './context';
import { isCanvas } from './utils';

export * from './enums';

export function createContext(gl: WebGLRenderingContext, options?: ContextOptions): Context;
export function createContext(canvas: HTMLCanvasElement, options?: WebGLContextAttributes & ContextOptions): Context;
export function createContext(
  obj: HTMLCanvasElement | WebGLRenderingContext,
  options?: WebGLContextAttributes & ContextOptions
): Context {
  if (isCanvas(obj)) {
    const gl = obj.getContext('webgl') || obj.getContext('experimental-webgl');
    if (gl === null) {
      throw new Error('Your browser does not support WebGL!');
    }
    obj = gl;
  }

  return new Context(obj, options);
}
