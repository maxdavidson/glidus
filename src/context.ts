import Buffer from './buffer';
import {
  BlendEquation, BlendFunction, BufferType, BufferUsage,
  ColorspaceConversionMode, ContextParameter, CullFaceMode, HintMode,
  ShaderType, StencilFunction, StencilOperation, TextureType, TextureUnit, WindingOrientation
} from './enums';
import Framebuffer from './framebuffer';
import Program from './program';
import Renderbuffer from './renderbuffer';
import Shader, { FragmentShader, VertexShader } from './shader';
import Texture, { CubeMap, Texture2D } from './texture';
import { FixedArray, FixedFloat32Array, FixedInt32Array, createDebugContext } from './utils';
import VertexArray from './vertex-array';

export interface ContextOptions {
  debug?: boolean;
}

export default class Context {

  readonly gl: WebGLRenderingContext;
  readonly bindings: {
    35725 /* [ContextParameter.CurrentProgram] */: Program | null;
    34964 /* [ContextParameter.ArrayBufferBinding] */: Buffer<BufferType.ArrayBuffer> | null;
    34965 /* [ContextParameter.ElementArrayBufferBinding] */: Buffer<BufferType.ElementArrayBuffer> | null;
    36006 /* [ContextParameter.FramebufferBinding] */: Framebuffer | null;
    36007 /* [ContextParameter.RenderbufferBinding] */: Renderbuffer | null;
    34229 /* [ContextParameter.WebGLVertexArrayObjectOES] */: VertexArray | null;
    32873 /* [ContextParameter.TextureBinding2D] */: Texture2D | null;
    34068 /* [ContextParameter.TextureBindingCubeMap] */: CubeMap | null;
  };

  readonly extensions: {
    readonly ANGLE_instanced_arrays: ANGLE_instanced_arrays;
    readonly EXT_blend_minmax?: EXTBlendMinMax;
    readonly EXT_color_buffer_half_float?: EXTColorBufferHalfFloat;
    readonly EXT_frag_depth?: EXTFragDepth;
    readonly EXT_sRGB?: EXTsRGB;
    readonly EXT_shader_texture_lod?: EXTShaderTextureLOD;
    readonly EXT_texture_filter_anisotropic?: EXTTextureFilterAnisotropic;

    readonly OES_element_index_uint?: OESElementIndexUint;
    readonly OES_standard_derivatives?: OESStandardDerivatives;
    readonly OES_texture_float?: OESTextureFloat;
    readonly OES_texture_float_linear?: OESTextureFloatLinear;
    readonly OES_texture_half_float?: OESTextureHalfFloat;
    readonly OES_texture_half_float_linear?: OESTextureHalfFloatLinear;
    readonly OES_vertex_array_object?: OESVertexArrayObject;

    readonly WEBGL_color_buffer_float?: WebGLColorBufferFloat;
    readonly WEBGL_compressed_texture_atc?: WebGLCompressedTextureATC;
    readonly WEBGL_compressed_texture_etc1?: WebGLCompressedTextureETC1;
    readonly WEBGL_compressed_texture_pvrtc?: WebGLCompressedTexturePVRTC;
    readonly WEBGL_compressed_texture_s3tc?: WebGLCompressedTextureS3TC;
    readonly WEBGL_debug_renderer_info?: WebGLDebugRendererInfo;
    readonly WEBGL_debug_shaders?: WebGLDebugShaders;
    readonly WEBGL_depth_texture?: WebGLDepthTexture;
    readonly WEBGL_draw_buffers?: WebGLDrawBuffers;
    readonly WEBGL_lose_context?: WebGLLoseContext;

    // Prefixed versions
    readonly WEBKIT_EXT_texture_filter_anisotropic?: EXTTextureFilterAnisotropic;
    readonly WEBKIT_WEBGL_compressed_texture_atc?: WebGLCompressedTextureATC;
    readonly WEBKIT_WEBGL_compressed_texture_pvrtc?: WebGLCompressedTexturePVRTC;
    readonly WEBKIT_WEBGL_compressed_texture_s3tc?: WebGLCompressedTextureS3TC;
    readonly WEBKIT_WEBGL_depth_texture?: WebGLDepthTexture;
    readonly WEBKIT_WEBGL_lose_context?: WebGLLoseContext;
    readonly MOZ_WEBGL_compressed_texture_s3tc?: WebGLCompressedTextureS3TC;
    readonly MOZ_WEBGL_depth_texture?: WebGLDepthTexture;
    readonly MOZ_WEBGL_lose_context?: WebGLLoseContext;
  };

  get currentProgram() {
    return this.bindings[ContextParameter.CurrentProgram];
  }

  constructor(gl: WebGLRenderingContext, { debug = false } = {}) {
    const extensions = {};
    const supportedExtensionNames = gl.getSupportedExtensions();
    if (supportedExtensionNames !== null) {
      supportedExtensionNames.forEach(name => {
        let cache;
        Object.defineProperty(extensions, name, {
          get() {
            if (cache === undefined) {
              cache = gl.getExtension(name);
            }
            return cache;
          },
          configurable: false,
          enumerable: true
        });
      });
    }

    this.gl = debug ? createDebugContext(gl) : gl;
    this.extensions = extensions as any;

    this.bindings = {
      [ContextParameter.CurrentProgram]: null,
      [ContextParameter.ArrayBufferBinding]: null,
      [ContextParameter.ElementArrayBufferBinding]: null,
      [ContextParameter.FramebufferBinding]: null,
      [ContextParameter.RenderbufferBinding]: null,
      [ContextParameter.VertexArrayBinding]: null,
      [ContextParameter.TextureBinding2D]: null,
      [ContextParameter.TextureBindingCubeMap]: null
    } as any;
  }

  /** Create a raw, uninitialized buffer of a specific type. */
  createRawBuffer<T extends BufferType>(type: T) {
    return new Buffer(this, type);
  }

  /** Create a buffer of type "ArrayBuffer" using some initial data */
  createArrayBuffer(data: number | ArrayBuffer | ArrayBufferView, usage?: BufferUsage) {
    const buffer = this.createRawBuffer(BufferType.ArrayBuffer);
    buffer.setData(data, usage);
    return buffer;
  }

  /** Create a buffer of type "ElementArrayBuffer" using some initial data */
  createElementArrayBuffer(data: number | ArrayBuffer | ArrayBufferView, usage?: BufferUsage) {
    const buffer = this.createRawBuffer(BufferType.ElementArrayBuffer);
    buffer.setData(data);
    return buffer;
  }

  /** Create a shader program from a pair of shaders */
  createProgram(vertexShader: VertexShader, fragmentShader: FragmentShader) {
    return new Program(this, vertexShader, fragmentShader);
  }

  /** Create a shader of a specific type */
  createRawShader<T extends ShaderType>(type: T, source: string) {
    return new Shader(this, type, source);
  }

  /** Create a fragment shader from source */
  createFragmentShader(source: string) {
    return this.createRawShader(ShaderType.FragmentShader, source);
  }

  /** Create a vertex shader from source */
  createVertexShader(source: string) {
    return this.createRawShader(ShaderType.VertexShader, source);
  }

  /** Create a raw, uninitialized shader of a specific type */
  createRawTexture<T extends TextureType>(type: T) {
    return new Texture(this, type);
  }

  /** Create a 2D texture */
  createTexture2D() {
    return this.createRawTexture(TextureType.Texture2D);
  }

  /** Create a CubeMap */
  createCubeMap() {
    return this.createRawTexture(TextureType.CubeMap);
  }

  /** Create a new framebuffer */
  createFramebuffer() {
    return new Framebuffer(this);
  }

  /** Create a new renderbuffer */
  createRenderbuffer() {
    return new Renderbuffer(this);
  }

  // Info
  getParameter(param: ContextParameter.Vendor): string;
  getParameter(param: ContextParameter.Renderer): string;
  getParameter(param: ContextParameter.Version): string;
  getParameter(param: ContextParameter.ShadingLanguageVersion): string;

  getParameter(param: ContextParameter.MaxTextureImageUnits): GLint;
  getParameter(param: ContextParameter.MaxCombinedTextureImageUnits): GLint;
  getParameter(param: ContextParameter.MaxCubeMapTextureSize): GLint;
  getParameter(param: ContextParameter.MaxRenderbufferSize): GLint;
  getParameter(param: ContextParameter.MaxTextureSize): GLint;
  getParameter(param: ContextParameter.MaxVaryingVectors): GLint;
  getParameter(param: ContextParameter.MaxVertexAttributes): GLint;
  getParameter(param: ContextParameter.MaxVertexTextureImageUnits): GLint;
  getParameter(param: ContextParameter.MaxVertexUniformVectors): GLint;
  getParameter(param: ContextParameter.MaxViewportDimensions): FixedInt32Array<2>;

  // Enabled features
  getParameter(param: ContextParameter.Blend): GLboolean;
  getParameter(param: ContextParameter.CullFace): GLboolean;
  getParameter(param: ContextParameter.DepthTest): GLboolean;
  getParameter(param: ContextParameter.Dither): GLboolean;
  getParameter(param: ContextParameter.ScissorTest): GLboolean;
  getParameter(param: ContextParameter.StencilTest): GLboolean;

  // Bit lengths
  getParameter(param: ContextParameter.RedBits): GLint;
  getParameter(param: ContextParameter.GreenBits): GLint;
  getParameter(param: ContextParameter.BlueBits): GLint;
  getParameter(param: ContextParameter.AlphaBits): GLint;
  getParameter(param: ContextParameter.DepthBits): GLint;
  getParameter(param: ContextParameter.StencilBits): GLint;
  getParameter(param: ContextParameter.SubpixelBits): GLint;

  // Blending
  getParameter(param: ContextParameter.BlendColor): FixedFloat32Array<4>;

  getParameter(param: ContextParameter.BlendEquation): BlendEquation;
  getParameter(param: ContextParameter.BlendEquationAlpha): BlendEquation;
  getParameter(param: ContextParameter.BlendEquationRGB): BlendEquation;

  getParameter(param: ContextParameter.BlendSourceAlpha): BlendFunction;
  getParameter(param: ContextParameter.BlendSourceRGB): BlendFunction;
  getParameter(param: ContextParameter.BlendDestinationAlpha): BlendFunction;
  getParameter(param: ContextParameter.BlendDestinationRGB): BlendFunction;

  // Bindings
  getParameter(param: ContextParameter.ActiveTextureUnit): TextureUnit;
  getParameter(param: ContextParameter.CurrentProgram): WebGLProgram | null;
  getParameter(param: ContextParameter.TextureBinding2D): WebGLTexture | null;
  getParameter(param: ContextParameter.TextureBindingCubeMap): WebGLTexture | null;
  getParameter(param: ContextParameter.ArrayBufferBinding): WebGLBuffer | null;
  getParameter(param: ContextParameter.VertexArrayBinding): WebGLVertexArrayObjectOES | null;
  getParameter(param: ContextParameter.ElementArrayBufferBinding): WebGLBuffer | null;
  getParameter(param: ContextParameter.FramebufferBinding): WebGLFramebuffer | null;
  getParameter(param: ContextParameter.RenderbufferBinding): WebGLRenderbuffer | null;

  // Alignment
  getParameter(param: ContextParameter.PackAlignment): 1 | 2 | 4 | 8;
  getParameter(param: ContextParameter.UnpackAlignment): 1 | 2 | 4 | 8;

  // Clear values
  getParameter(param: ContextParameter.StencilClearValue): GLint;
  getParameter(param: ContextParameter.ColorClearValue): FixedFloat32Array<4>;
  getParameter(param: ContextParameter.DepthClearValue): GLfloat;

  // Write masks
  getParameter(param: ContextParameter.StencilWritemask): GLuint;
  getParameter(param: ContextParameter.StencilBackWritemask): GLuint;
  getParameter(param: ContextParameter.DepthWritemask): GLboolean;
  getParameter(param: ContextParameter.ColorWritemask): FixedArray<boolean, 4>;

  getParameter(param: ContextParameter.ScissorBox): FixedInt32Array<4>;

  // Stencil ops
  getParameter(param: ContextParameter.StencilFail): StencilOperation;
  getParameter(param: ContextParameter.StencilBackFail): StencilOperation;
  getParameter(param: ContextParameter.StencilBackPassDepthFail): StencilOperation;
  getParameter(param: ContextParameter.StencilBackPassDepthPass): StencilOperation;
  getParameter(param: ContextParameter.StencilPassDepthFail): StencilOperation;
  getParameter(param: ContextParameter.StencilPassDepthPass): StencilOperation;

  // Stencil funcs
  getParameter(param: ContextParameter.StencilFunction): StencilFunction;
  getParameter(param: ContextParameter.StencilValueMask): StencilFunction;
  getParameter(param: ContextParameter.StencilRef): StencilFunction;
  getParameter(param: ContextParameter.StencilBackFunction): StencilFunction;
  getParameter(param: ContextParameter.StencilBackValueMask): StencilFunction;
  getParameter(param: ContextParameter.StencilBackRef): StencilFunction;

  getParameter(param: ContextParameter.CullFaceMode): CullFaceMode;
  getParameter(param: ContextParameter.LineWidth): GLfloat;
  getParameter(param: ContextParameter.AliasedLineWidthRange): FixedFloat32Array<2>;
  getParameter(param: ContextParameter.AliasedPointSizeRange): FixedFloat32Array<2>;
  getParameter(param: ContextParameter.CompressedTextureFormats): Uint32Array;
  getParameter(param: ContextParameter.DepthRange): FixedFloat32Array<2>;
  getParameter(param: ContextParameter.Samples): GLint;
  getParameter(param: ContextParameter.SampleCoverageInvert): GLboolean;
  getParameter(param: ContextParameter.SampleCoverageValue): GLfloat;
  getParameter(param: ContextParameter.UnpackFlipY): GLboolean;
  getParameter(param: ContextParameter.UnpackPremultiplyAlpha): GLboolean;
  getParameter(param: ContextParameter.SampleBuffers): GLint;
  getParameter(param: ContextParameter.PolygonOffsetFactor): GLfloat;
  getParameter(param: ContextParameter.PolygonOffsetFill): GLint;
  getParameter(param: ContextParameter.PolygonOffsetUnits): GLfloat;
  getParameter(param: ContextParameter.DepthFunction): StencilFunction;
  getParameter(param: ContextParameter.FrontFace): WindingOrientation;
  getParameter(param: ContextParameter.GenerateMipmapHint): HintMode;
  getParameter(param: ContextParameter.UnpackColorspaceConversion): ColorspaceConversionMode;

  getParameter(param: ContextParameter) {
    return this.gl.getParameter(param);
  }
}
