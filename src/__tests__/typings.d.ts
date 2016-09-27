declare module 'gl' {
  export default function createContext(width: number, height: number, options?: WebGLContextAttributes): WebGLRenderingContext;
}
