import Context from './context';
import { ShaderParameter, ShaderType } from './enums';
import { randomString } from './utils';

export type VertexShader = Shader<ShaderType.VertexShader>;
export type FragmentShader = Shader<ShaderType.FragmentShader>;

export default class Shader<T extends ShaderType> {

  readonly id = randomString();
  readonly handle: WebGLShader;

  constructor(
    public readonly context: Context,
    public readonly type: T,
    public readonly source: string
  ) {
    if (!(context instanceof Context)) {
      throw new TypeError('context must be a Context');
    }

    if (type !== ShaderType.FragmentShader && type !== ShaderType.VertexShader) {
      throw new TypeError('type must be a ShaderType');
    }

    if (typeof source !== 'string') {
      throw new TypeError('source must be a string');
    }

    const handle = context.gl.createShader(type);

    if (handle === null) {
      throw new Error('Failed creating WebGLShader');
    }

    this.handle = handle;

    context.gl.shaderSource(handle, source);
    context.gl.compileShader(handle);

    if (!this.isCompiled()) {
      throw new Error(`Shader did not compile: ${this.getInfoLog()}`);
    }
  }

  isCompiled() { return this.getParameter(ShaderParameter.CompileStatus); }
  isDeleted() { return this.getParameter(ShaderParameter.DeleteStatus); }
  getInfoLog() { return this.context.gl.getShaderInfoLog(this.handle); }

  getParameter(param: ShaderParameter.CompileStatus): boolean;
  getParameter(param: ShaderParameter.DeleteStatus): boolean;
  getParameter(param: ShaderParameter) {
    return this.context.gl.getShaderParameter(this.handle, param);
  }

  delete() {
    this.context.gl.deleteShader(this.handle);
  }
}
