import Context from './context';
import { BufferParameter, BufferType, BufferUsage , ContextParameter} from './enums';
import { randomString } from './utils';

export default class Buffer<T extends BufferType> {

  readonly id = randomString();
  readonly handle: WebGLBuffer;

  constructor(
    public readonly context: Context,
    public readonly type: T
  ) {
    if (!(context instanceof Context)) {
      throw new TypeError('context must be a Context');
    }

    if (type !== BufferType.ArrayBuffer && type !== BufferType.ElementArrayBuffer) {
      throw new TypeError('type must be a BufferType');
    }

    const handle = context.gl.createBuffer();
    if (handle === null) {
      throw new Error('Failed creating WebGLBuffer');
    }

    this.handle = handle;
  }

  setData(data: number | ArrayBuffer | ArrayBufferView, usage = BufferUsage.StaticDraw) {
    this.bind();
    this.context.gl.bufferData(this.type, data, usage);
  }

  setSubData(data: ArrayBuffer |  ArrayBufferView, offset: number) {
    this.bind();
    this.context.gl.bufferSubData(this.type, offset, data);
  }

  getParameter(param: BufferParameter.BufferSize): number;
  getParameter(param: BufferParameter.BufferUsage): BufferUsage;
  getParameter(param: BufferParameter) {
    this.bind();
    return this.context.gl.getBufferParameter(this.type, param);
  }

  bind() {
    const bindingParameter = getBindingParameter(this.type);
    if (this.context.bindings[bindingParameter] !== this) {
      this.context.gl.bindBuffer(this.type, this.handle);
      this.context.bindings[bindingParameter] = this;
    }
  }

  unbind() {
    const bindingParameter = getBindingParameter(this.type);
    if (this.context.bindings[bindingParameter] !== null) {
      this.context.gl.bindBuffer(this.type, null);
      this.context.bindings[bindingParameter] = null;
    }
  }

  delete() {
    this.context.gl.deleteBuffer(this.handle);
  }
}

function getBindingParameter(type: BufferType) {
  switch (type) {
    case BufferType.ArrayBuffer:
      return ContextParameter.ArrayBufferBinding;
    case BufferType.ElementArrayBuffer:
      return ContextParameter.ElementArrayBufferBinding;
    default:
      throw new TypeError(`Invalid type: ${type}`);
  }
}
