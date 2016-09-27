import Context from './context';
import { AttributeType, ContextParameter, ProgramParameter, ShaderType, UniformType } from './enums';
import Shader, { FragmentShader, VertexShader } from './shader';
import { FixedFloat32Array, ObjectOf, randomString } from './utils';

export default class Program {

  readonly id = randomString();
  readonly handle: WebGLProgram;
  readonly uniforms = {} as ObjectOf<Uniform>;
  readonly attributes = {} as ObjectOf<Attribute>;

  constructor(
    public readonly context: Context,
    public readonly vertexShader: VertexShader,
    public readonly fragmentShader: FragmentShader
  ) {
    if (!(context instanceof Context)) {
      throw new TypeError('context must be a Context');
    }

    if (!(fragmentShader instanceof Shader) || fragmentShader.type !== ShaderType.FragmentShader) {
      throw new TypeError('fragmentShader must be a Shader of type FragmentShader');
    }

    if (!(vertexShader instanceof Shader) || vertexShader.type !== ShaderType.VertexShader) {
      throw new TypeError('vertexShader must be a Shader of type VertexShader');
    }

    const handle = context.gl.createProgram();

    if (handle === null) {
      throw new Error('Failed creating WebGLProgram');
    }

    this.handle = handle;

    context.gl.attachShader(handle, vertexShader.handle);
    context.gl.attachShader(handle, fragmentShader.handle);
    context.gl.linkProgram(handle);

    if (!this.isLinked()) {
      throw new Error(`Error linking program: ${this.getInfoLog()}`);
    }

    context.gl.validateProgram(handle);

    if (!this.isValid()) {
      throw new Error(`Error validating program: ${this.getInfoLog()}`);
    }

    // Query uniform types and locations
    const uniformCount = this.getParameter(ProgramParameter.ActiveUniforms);
    for (let i = 0; i < uniformCount; ++i) {
      const uniform = new Uniform(this, i);
      this.uniforms[uniform.name] = uniform;
    }

    // Query attribute types and locations
    const attributeCount = this.getParameter(ProgramParameter.ActiveAttributes);
    for (let i = 0; i < attributeCount; ++i) {
      const attribute = new Attribute(this, i);
      this.attributes[attribute.name] = attribute;
    }
  }

  isValid() { return this.getParameter(ProgramParameter.ValidateStatus); }
  isLinked() { return this.getParameter(ProgramParameter.LinkStatus); }
  isDeleted() { return this.getParameter(ProgramParameter.DeleteStatus); }
  getInfoLog() { return this.context.gl.getProgramInfoLog(this.handle); }

  getParameter(param: ProgramParameter.ActiveAttributes): number;
  getParameter(param: ProgramParameter.ActiveUniforms): number;
  getParameter(param: ProgramParameter.LinkStatus): boolean;
  getParameter(param: ProgramParameter.ValidateStatus): boolean;
  getParameter(param: ProgramParameter.DeleteStatus): boolean;
  getParameter(param: ProgramParameter.AttachedShaders): WebGLShader[];
  getParameter(param: ProgramParameter) {
    return this.context.gl.getProgramParameter(this.handle, param);
  }

  use() {
    if (this.context.bindings[ContextParameter.CurrentProgram] !== this) {
      this.context.gl.useProgram(this.handle);
      this.context.bindings[ContextParameter.CurrentProgram] = this;
    }
  }

  unuse() {
    if (this.context.bindings[ContextParameter.CurrentProgram] !== null) {
      this.context.gl.useProgram(null);
      this.context.bindings[ContextParameter.CurrentProgram] = null;
    }
  }

  delete() {
    this.context.gl.deleteProgram(this.handle);
  }
}

export class Uniform {
  readonly location: WebGLUniformLocation;
  readonly name: string;
  readonly size: number;
  readonly type: UniformType;
  readonly set: (...values: any[]) => void;

  constructor(public readonly program: Program, index: number) {
    const info = program.context.gl.getActiveUniform(program.handle, index);

    if (info === null) {
      throw new Error(`Could not fetch uniform info at index: ${index}`);
    }

    const location = program.context.gl.getUniformLocation(program.handle, info.name);

    if (location === null) {
      throw new Error(`Could not fetch uniform location for name: ${info.name}`);
    }

    this.location = location;
    this.name = info.name;
    this.size = info.size;
    this.type = info.type;
    this.set = createUniformSetter(this.program.context.gl, Location, info.type);
  }

  get(value: any) {
    return this.program.context.gl.getUniform(this.program, this.location);
  }
}

export class Attribute {
  readonly location: number;
  readonly name: string;
  readonly size: number;
  readonly type: AttributeType;

  constructor(public readonly program: Program, index: number) {
    const info = program.context.gl.getActiveAttrib(program.handle, index);

    if (info === null) {
      throw new Error(`Could not fetch attribute info at index: ${index}`);
    }

    const location = program.context.gl.getAttribLocation(program.handle, info.name);

    if (location === null) {
      throw new Error(`Could not fetch attribute location for name: ${info.name}`);
    }

    this.program = program;
    this.location = location;
    this.name = info.name;
    this.size = info.size;
    this.type = info.type;
  }
}

function createUniformSetter(
  gl: WebGLRenderingContext,
  location: WebGLUniformLocation,
  type: UniformType
): (...values: any[]) => void {
  switch (type) {
    case UniformType.Bool:
    case UniformType.Int:
    case UniformType.UnsignedInt:
    case UniformType.Sampler2D:
    case UniformType.SamplerCube:
      return function setInt(value: number) {
        gl.uniform1i(location, value);
      };

    case UniformType.Bool2:
    case UniformType.Int2:
      return function setInt2(valueA: number, valueB: number) {
        gl.uniform2i(location, valueA, valueB);
      };

    case UniformType.Bool3:
    case UniformType.Int3:
      return function setInt3(valueA: number, valueB: number, valueC: number) {
        gl.uniform3i(location, valueA, valueB, valueC);
      };

    case UniformType.Bool4:
    case UniformType.Int4:
      return function setInt4(valueA: number, valueB: number, valueC: number, valueD: number) {
        gl.uniform4i(location, valueA, valueB, valueC, valueD);
      };

    case UniformType.Float:
      return function setFloat(value: number) {
        gl.uniform1f(location, value);
      };

    case UniformType.Float2:
      return function setFloat2(valueA: number, valueB: number) {
        gl.uniform2f(location, valueA, valueB);
      };

    case UniformType.Float3:
      return function setFloat3(valueA: number, valueB: number, valueC: number) {
        gl.uniform3f(location, valueA, valueB, valueC);
      };

    case UniformType.Float4:
      return function setFloat4(valueA: number, valueB: number, valueC: number, valueD: number) {
        gl.uniform4f(location, valueA, valueB, valueC, valueD);
      };

    case UniformType.Mat2:
      return function setMat2(value: FixedFloat32Array<4>) {
        gl.uniformMatrix2fv(location, false, value);
      };

    case UniformType.Mat3:
      return function setMat3(value: FixedFloat32Array<9>) {
        gl.uniformMatrix3fv(location, false, value);
      };

    case UniformType.Mat4:
      return function setMat4(value: FixedFloat32Array<4>) {
        gl.uniformMatrix4fv(location, false, value);
      };

    default:
      throw new Error(`Invalid uniform type: ${type}`);
  }
}
