import Context from './context';
import {
  ContextParameter,
  CubeMapFace,
  FramebufferAttachmentColorEncoding,
  FramebufferAttachmentComponentType,
  FramebufferAttachmentObjectType,
  FramebufferAttachmentParameter,
  FramebufferAttachmentType,
  FramebufferStatus,
  FramebufferType,
  TextureTarget
} from './enums';
import Renderbuffer from './renderbuffer';
import { Texture2D } from './texture';
import { randomString } from './utils';

export default class Framebuffer {

  readonly id = randomString();
  readonly handle: WebGLFramebuffer;
  readonly type = FramebufferType.Framebuffer;
  readonly colorAttachment = this.getAttachment(FramebufferAttachmentType.ColorAttachment0);
  readonly depthAttachment = this.getAttachment(FramebufferAttachmentType.DepthAttachment);
  readonly stencilAttachment = this.getAttachment(FramebufferAttachmentType.StencilAttachment);

  get status(): FramebufferStatus {
    this.bind();
    return this.context.gl.checkFramebufferStatus(this.type);
  }

  constructor(public readonly context: Context) {
    if (!(context instanceof Context)) {
      throw new TypeError('context must be a Context');
    }

    const handle = context.gl.createFramebuffer();
    if (handle === null) {
      throw new Error('Failed creating WebGLFramebuffer');
    }

    this.handle = handle;
  }

  getAttachment<T extends FramebufferAttachmentType>(type: T): FramebufferAttachment<T> {
    return new FramebufferAttachment(this, type);
  }

  bind() {
    if (this.context.bindings[ContextParameter.FramebufferBinding] !== this) {
      this.context.gl.bindFramebuffer(this.type, this.handle);
      this.context.bindings[ContextParameter.FramebufferBinding] = this;
    }
  }

  unbind() {
    if (this.context.bindings[ContextParameter.FramebufferBinding] !== null) {
      this.context.gl.bindFramebuffer(this.type, null);
      this.context.bindings[ContextParameter.FramebufferBinding] = null;
    }
  }

  delete() {
    this.context.gl.deleteFramebuffer(this.handle);
  }
}

export type FramebufferAttachmentObjectInfo =
   { type: FramebufferAttachmentObjectType.None, handle: null }
  | { type: FramebufferAttachmentObjectType.Texture, handle: WebGLTexture }
  | { type: FramebufferAttachmentObjectType.Renderbuffer, handle: WebGLRenderbuffer };

export class FramebufferAttachment<T extends FramebufferAttachmentType> {

  get objectInfo() {
    return {
      handle: this.getParameter(FramebufferAttachmentParameter.ObjectHandle),
      type: this.getParameter(FramebufferAttachmentParameter.ObjectType)
    } as FramebufferAttachmentObjectInfo;
  }

  constructor(
    public readonly framebuffer: Framebuffer,
    public readonly type: T
  ) {
    if (!(framebuffer instanceof Framebuffer)) {
      throw new TypeError('framebuffer must be a Framebuffer');
    }

    if (type !== FramebufferAttachmentType.ColorAttachment0
      && type !== FramebufferAttachmentType.DepthAttachment
      && type !== FramebufferAttachmentType.StencilAttachment) {
      throw new TypeError('type must ba a FramebufferAttachmentType');
    }
  }

  setRenderbuffer(renderbuffer: Renderbuffer) {
    this.framebuffer.bind();
    const gl = this.framebuffer.context.gl;
    gl.framebufferRenderbuffer(this.framebuffer.type, this.type, renderbuffer.type, renderbuffer.handle);
  }

  setTexture2D(texture: Texture2D, level = 0) {
    this.framebuffer.bind();
    const gl = this.framebuffer.context.gl;
    gl.framebufferTexture2D(this.framebuffer.type, this.type, TextureTarget.Texture2D, texture.handle, level);
  }

  getParameter(param: FramebufferAttachmentParameter.ObjectType): FramebufferAttachmentObjectType;
  getParameter(param: FramebufferAttachmentParameter.ObjectHandle): WebGLTexture | WebGLRenderbuffer | null;
  getParameter(param: FramebufferAttachmentParameter.TextureLevel): number | null;
  getParameter(param: FramebufferAttachmentParameter.CubeMapFace): CubeMapFace | null;
  getParameter(param: FramebufferAttachmentParameter.TextureLayer): number | null;
  getParameter(param: FramebufferAttachmentParameter.ColorEncoding): FramebufferAttachmentColorEncoding;
  getParameter(param: FramebufferAttachmentParameter.ComponentType): FramebufferAttachmentComponentType;
  getParameter(param: FramebufferAttachmentParameter.RedSize): number;
  getParameter(param: FramebufferAttachmentParameter.GreenSize): number;
  getParameter(param: FramebufferAttachmentParameter.BlueSize): number;
  getParameter(param: FramebufferAttachmentParameter.AlphaSize): number;
  getParameter(param: FramebufferAttachmentParameter.DepthSize): number;
  getParameter(param: FramebufferAttachmentParameter.StencilSize): number;
  getParameter(param: FramebufferAttachmentParameter) {
    this.framebuffer.bind();
    const gl = this.framebuffer.context.gl;
    return gl.getFramebufferAttachmentParameter(this.framebuffer.type, this.type, param);
  }
}
