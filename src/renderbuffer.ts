import Context from './context';
import { ContextParameter, RenderbufferInternalFormat, RenderbufferParameter, RenderbufferType } from './enums';
import { randomString } from './utils';

export default class Renderbuffer {

  readonly id = randomString();
  readonly type = RenderbufferType.Renderbuffer;
  readonly handle: WebGLRenderbuffer;

  get width() { return this.getParameter(RenderbufferParameter.Width); }
  get height() { return this.getParameter(RenderbufferParameter.Height); }

  constructor(public readonly context: Context) {
    if (!(context instanceof Context)) {
      throw new TypeError('context must be a Context');
    }

    const handle = context.gl.createRenderbuffer();
    if (handle === null) {
      throw new Error('Failed creating WebGLRenderbuffer');
    }

    this.handle = handle;
  }

  setStorage(width: number, height: number, internalFormat = RenderbufferInternalFormat.RGBA4) {
    this.bind();
    this.context.gl.renderbufferStorage(this.type, internalFormat, width, height);
  }

  getParameter(param: RenderbufferParameter.Height): number;
  getParameter(param: RenderbufferParameter.Width): number;
  getParameter(param: RenderbufferParameter.InternalFormat): RenderbufferInternalFormat;
  getParameter(param: RenderbufferParameter.RedSize): number;
  getParameter(param: RenderbufferParameter.GreenSize): number;
  getParameter(param: RenderbufferParameter.BlueSize): number;
  getParameter(param: RenderbufferParameter.AlphaSize): number;
  getParameter(param: RenderbufferParameter.DepthSize): number;
  getParameter(param: RenderbufferParameter.StencilSize): number;
  getParameter(param: RenderbufferParameter) {
    this.bind();
    return this.context.gl.getRenderbufferParameter(this.type, param);
  }

  bind() {
    if (this.context.bindings[ContextParameter.RenderbufferBinding] !== this) {
      this.context.gl.bindRenderbuffer(this.type, this.handle);
      this.context.bindings[ContextParameter.RenderbufferBinding] = this;
    }
  }

  unbind() {
    if (this.context.bindings[ContextParameter.RenderbufferBinding] !== null) {
      this.context.gl.bindRenderbuffer(this.type, null);
      this.context.bindings[ContextParameter.RenderbufferBinding] = null;
    }
  }

  delete() {
    this.context.gl.deleteRenderbuffer(this.handle);
  }
}
