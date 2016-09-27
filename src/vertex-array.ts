import Buffer from './buffer';
import Context from './context';
import { BufferDataType, BufferType, ContextParameter } from './enums';
import { ObjectOf, getBufferDataTypeSize } from './utils';

export default class VertexArray {

  private readonly _configs = {} as ObjectOf<string>;
  private readonly _vaos = {} as ObjectOf<FakeVertexArray | NativeVertexArray>;
  private readonly _bindings = { fixed: {}, index: null, named: {} } as {
    index: Buffer<BufferType.ElementArrayBuffer> | null;
    readonly fixed: ObjectOf<AttribPointer>;
    readonly named: ObjectOf<AttribPointer>;
  };

  constructor(public readonly context: Context) {
    if (!(context instanceof Context)) {
      throw new TypeError('context must be a Context');
    }
  }

  setIndexAttribute(indexBuffer: Buffer<BufferType.ElementArrayBuffer>) {
    if (indexBuffer.type !== BufferType.ElementArrayBuffer) {
      throw new TypeError(`You can't add non-index buffer to a location!`);
    }

    this._bindings.index = indexBuffer;
  }

  /** Bind a vertex buffer to either a named attribute, or an absolute location. */
  addAttribute(location: string | number, buffer: Buffer<BufferType.ArrayBuffer>, {
    size = 4,
    dataType = BufferDataType.Float,
    normalized = false,
    stride,
    offset = 4
  }: AttribOptions = {}) {
    if (location !== -1 && buffer.type !== BufferType.ArrayBuffer) {
      throw new TypeError(`You can't add an index buffer to a location!`);
    }
    if (stride === undefined) {
      stride = getBufferDataTypeSize(dataType);
    }

    const pointer = { buffer, size, dataType, normalized, stride, offset };

    switch (typeof location) {
      case 'string':
        this._bindings.named[location] = pointer;
        break;

      case 'number':
        this._bindings.fixed[location] = pointer;
        break;

      default:
        throw new TypeError(`Invalid location type: ${typeof location}`);
    }
  }

  removeAttribute(location: string | number) {
    switch (typeof location) {
      case 'string':
        delete this._bindings.named[location];
        break;

      case 'number':
        delete this._bindings.fixed[location];
        break;

      default:
        throw new TypeError(`Invalid location type: ${typeof location}`);
    }
  }

  bind() {
    if (this.context.bindings[ContextParameter.VertexArrayBinding] !== this) {
      this._getVao().bind();
      this.context.bindings[ContextParameter.VertexArrayBinding] = this;
    }
  }

  unbind() {
    if (this.context.bindings[ContextParameter.VertexArrayBinding] !== null) {
      this._getVao().unbind();
      this.context.bindings[ContextParameter.VertexArrayBinding] = null;
    }
  }

  private _getVao() {
    const program = this.context.bindings[ContextParameter.CurrentProgram];
    if (program === null) {
      throw new Error('There is no active program!');
    }

    // Get the config for the program
    let config = this._configs[program.id];
    if (config === undefined) {
      const names = Object.keys(this._bindings.named).sort();
      const map = names.reduce((obj, name) => (obj[name] = this.context.gl.getAttribLocation(program, name), obj), {});
      config = this._configs[program.id] = JSON.stringify(map);
    }

    // Get the VAO for the config
    let vao = this._vaos[config];
    if (vao === undefined) {
      vao = createVao(this.context);
      vao.setIndex(this._bindings.index!);

      // Add the named bindings by using the mapper
      for (let name in this._bindings.named) {
        const bindingIndex = config[name];
        if (bindingIndex === undefined) {
          throw new Error(`Binding ${name} does not exist in config!`);
        }
        vao.add(bindingIndex, this._bindings.named[name]!);
      }

      // Add the fixed bindings
      for (let key in this._bindings.fixed) {
        const index = parseInt(key, 10);
        vao.add(index, this._bindings.fixed[index]!);
      }
    }

    return vao;
  }
}

export interface AttribOptions {
  /** The number of components per attribute. Default: 4 */
  size?: number;
  /** The data type of each component in the array. Default: FLOAT */
  dataType?: BufferDataType;
  /** Whether integer values are converted to the range 0-1. Default: false */
  normalized?: boolean;
  /** The byte offset between attribute groups. Default: 4 */
  stride?: number;
  /** The byte offset until this attribute first appears. Default: 0 */
  offset?: number;
}

interface AttribPointer {
  buffer: Buffer<BufferType.ArrayBuffer>;
  size: number;
  dataType: BufferDataType;
  normalized: boolean;
  stride: number;
  offset: number;
}

function createVao(context: Context): NativeVertexArray | FakeVertexArray {
  const ext = context.extensions.OES_vertex_array_object;
  if (ext !== undefined) {
    return new NativeVertexArray(context, ext);
  }
  return new FakeVertexArray(context);
}

class NativeVertexArray {

  readonly handle: WebGLVertexArrayObjectOES;

  constructor(
    public readonly context: Context,
    public readonly ext: OESVertexArrayObject
  ) {
    if (!(context instanceof Context)) {
      throw new TypeError('context must be a Context');
    }

    const handle = ext.createVertexArrayOES() as WebGLVertexArrayObjectOES | null;
    if (handle === null) {
      throw new Error('Failed creating WebGLVertexArrayObjectOES');
    }
    this.handle = handle;
  }

  setIndex(indexBuffer: Buffer<BufferType.ElementArrayBuffer>) {
    this.bind();
    indexBuffer.bind();
    this.unbind();
  }

  add(index: number, { buffer, size, dataType, normalized, stride, offset }: AttribPointer) {
    this.bind();
    buffer.bind();
    this.context.gl.vertexAttribPointer(index, size, dataType, normalized, stride, offset);
    this.context.gl.enableVertexAttribArray(index);
    this.unbind();
  }

  remove(index: number) {
    this.bind();
    this.context.gl.disableVertexAttribArray(index);
    this.unbind();
  }

  bind() {
    this.ext.bindVertexArrayOES(this.handle);
  }

  unbind() {
    this.ext.bindVertexArrayOES(null as any);
  }

  delete() {
    this.ext.deleteVertexArrayOES(this.handle);
  }
}

class FakeVertexArray {

  private readonly _bindings = { fixed: {}, index: null } as {
    index: Buffer<BufferType.ElementArrayBuffer> |  null;
    readonly fixed: ObjectOf<AttribPointer>;
  };

  constructor(public readonly context: Context) {
    if (!(context instanceof Context)) {
      throw new TypeError('context must be a Context');
    }
  }

  setIndex(indexBuffer: Buffer<BufferType.ElementArrayBuffer>) {
    this._bindings.index = indexBuffer;
  }

  add(index: number, pointer: AttribPointer) {
    this._bindings.fixed[index] = pointer;
  }

  remove(index: number) {
    delete this._bindings.fixed[index];
  }

  bind() {
    this._bindings.index!.bind();
    for (let key in this._bindings.fixed) {
      const { buffer, size, dataType, normalized, stride, offset } = this._bindings.fixed[key]!;
      buffer.bind();
      const index = parseInt(key, 10);
      this.context.gl.enableVertexAttribArray(index);
      this.context.gl.vertexAttribPointer(index, size, dataType, normalized, stride, offset);
    }
  }

  unbind() {
    this._bindings.index!.unbind();
    for (let key in this._bindings.fixed) {
      const { buffer } = this._bindings.fixed[key]!;
      buffer.unbind();
      const index = parseInt(key, 10);
      this.context.gl.disableVertexAttribArray(index);
    }
  }
}
