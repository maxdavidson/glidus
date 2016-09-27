import Context from './context';
import { ContextParameter, TextureInternalFormat, TextureTarget, TextureTexelDataType, TextureType } from './enums';
import { randomString } from './utils';

export type Texture2D = Texture<TextureType.Texture2D>;
export type CubeMap = Texture<TextureType.CubeMap>;

export default class Texture<T extends TextureType> {

  readonly id = randomString();
  readonly handle: WebGLTexture;

  constructor(
    public readonly context: Context,
    public readonly type: T
  ) {
    if (!(context instanceof Context)) {
      throw new TypeError('context must be a Context');
    }

    if (type !== TextureType.Texture2D && type !== TextureType.CubeMap) {
      throw new TypeError('type must be a TextureType');
    }

    const handle = context.gl.createTexture();

    if (handle === null) {
      throw new Error('Failed creating WebGLTexture');
    }

    this.handle = handle;
  }

  setImage(image: ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | ArrayBufferView | undefined, {
    width = (image as ImageData).width,
    height = (image as ImageData).height,
    level = 0,
    type = TextureTexelDataType.UnsignedByte,
    format = TextureInternalFormat.RGBA,
    target = TextureTarget.Texture2D
  } = {}) {
    this.bind();
    if (image == null || ArrayBuffer.isView(image)) {
      this.context.gl.texImage2D(target, level, format, width, height, 0, format, type, image);
    } else {
      this.context.gl.texImage2D(target, level, format, format, type, image);
    }
  }

  setSubImage(image: ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | ArrayBufferView | undefined, {
    x = 0,
    y = 0,
    width = (image as ImageData).width,
    height = (image as ImageData).height,
    level = 0,
    type = TextureTexelDataType.UnsignedByte,
    format = TextureInternalFormat.RGBA,
    target = TextureTarget.Texture2D
  } = {}) {
    this.bind();
    if (image == null || ArrayBuffer.isView(image)) {
      this.context.gl.texSubImage2D(target, level, x, y, width, height, format, type, image);
    } else {
      this.context.gl.texSubImage2D(target, level, x, y, format, type, image);
    }
  }

  bind() {
    const bindingParamter = getBindingParameter(this.type);
    if (this.context[bindingParamter] !== this) {
      this.context.gl.bindTexture(this.type, this.handle);
      this.context.bindings[bindingParamter] = this;
    }
  }

  unbind() {
    const bindingParamter = getBindingParameter(this.type);
    if (this.context[bindingParamter] !== null) {
      this.context.gl.bindTexture(this.type, null);
      this.context.bindings[bindingParamter] = null;
    }
  }

  delete() {
    this.context.gl.deleteTexture(this.handle);
  }
}

function getBindingParameter(type: TextureType) {
  switch (type) {
    case TextureType.Texture2D:
      return ContextParameter.TextureBinding2D;
    case TextureType.CubeMap:
      return ContextParameter.TextureBindingCubeMap;
    default:
      throw new TypeError(`Invalid type: ${type}`);
  }
}
