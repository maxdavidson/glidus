export const enum BufferType {
  ArrayBuffer = 34962,
  ElementArrayBuffer = 34963
}

export const enum BufferUsage {
  StreamDraw = 35040,
  StaticDraw = 35044,
  DynamicDraw = 35048
}

export const enum BufferDataType {
  Byte = 5120,
  UnsignedByte = 5121,
  Short = 5122,
  UnsignedShort = 5123,
  Float = 5126
}

export const enum BufferParameter {
  BufferSize = 34660,
  BufferUsage = 34661
}

export const enum ContextError {
  NoError = 0,
  InvalidEnum = 1280,
  InvalidValue = 1281,
  InvalidOperation = 1282,
  OutOfMemory = 1285,
  InvalidFramebufferOperation = 1286,
  ContextLost = 37442
}

export const enum BlendEquation {
  /** source + destination */
  FuncAdd = 32774,
  /** source - destination */
  FuncSubtract = 32778,
  /** destination - source */
  FuncReverseSubtract = 32779,
  /** Minimum of source and destination */
  Min = 32775,
  /** Maximum of source and destination */
  Max = 32776
}

export const enum BlendFunction {
  /** Multiplies all colors by 0. */
  Zero = 0,
  /** Multiplies all colors by 1. */
  One = 1,
  /** Multiplies all colors by the source colors. */
  SourceColor = 768,
  /** Multiplies all colors by 1 minus each source color. */
  OneMinusSourceColor = 769,
  /** Multiplies all colors by the source alpha color. */
  SourceAlpha = 770,
  /** Multiplies all colors by 1 minus the source alpha color. */
  OneMinusSourceAlpha = 771,
  /** Multiplies all colors by the destination alpha color. */
  DestinationAlpha = 772,
  /** Multiplies all colors by 1 minus the destination alpha color. */
  OneMinusDestinationAlpha = 773,
  /** Multiplies all colors by the destination color. */
  DestinationColor = 774,
  /** Multiplies all colors by 1 minus each destination color. */
  OneMinusDestinationColor = 775,
  /**
   * Multiplies the RGB colors by the smaller of either the source alpha color or the value
   * of 1 minus the destination alpha color. The alpha value is multiplied by 1.
   */
  SourceAlphaSaturate = 776
}

export const enum CullFaceMode {
  Front = 1028,
  Back = 1029,
  FrontAndBack = 1032
}

export const enum FramebufferType {
  Framebuffer = 36160,
  ReadFramebuffer = 36008,
  DrawFramebuffer = 36009
}

export const enum FramebufferStatus {
  Complete = 36053,
  IncompleteAttachment = 36054,
  IncompleteMissingAttachment = 36055,
  IncompleteDimensions = 36055,
  Unsupported = 36061
}

export const enum PixelFormat {
  Alpha = 6406,
  RGB = 6407,
  RGBA = 6408
}

export const enum PixelDataType {
  /** 8 bits per channel for gl.RGBA */
  UnsignedByte = 5121,
  /** 5 red bits, 6 green bits, 5 blue bits */
  UnsignedShort_5_6_5 = 33635,
  /** 4 red bits, 4 green bits, 4 blue bits, 4 alpha bits */
  UnsignedShort_4_4_4_4 = 32819,
  /** 5 red bits, 5 green bits, 5 blue bits, 1 alpha bit */
  UnsignedShort_5_5_5_1 = 32820,
  Float = 5126
}

export const enum UniformType {
  Int = 5124,
  UnsignedInt = 5125,
  Float = 5126,
  Float2 = 35664,
  Float3 = 35665,
  Float4 = 35666,
  Int2 = 35667,
  Int3 = 35668,
  Int4 = 35669,
  Bool = 35670,
  Bool2 = 35671,
  Bool3 = 35672,
  Bool4 = 35673,
  Mat2 = 35674,
  Mat3 = 35675,
  Mat4 = 35676,
  Sampler2D = 35678,
  SamplerCube = 35680
}

export const enum AttributeType {
  Float = 5126,
  Float2 = 35664,
  Float3 = 35665,
  Float4 = 35666,
  Mat2 = 35674,
  Mat3 = 35675,
  Mat4 = 35676
}

export const enum ProgramParameter {
  DeleteStatus = 35712,
  LinkStatus = 35714,
  ValidateStatus = 35715,
  AttachedShaders = 35717,
  ActiveUniforms = 35718,
  ActiveAttributes = 35721
}

export const enum ShaderType {
  FragmentShader = 35632,
  VertexShader = 35633
}

export const enum ShaderParameter {
  DeleteStatus = 35712,
  CompileStatus = 35713
}

export const enum TextureType {
  Texture2D = 3553,
  CubeMap = 34067
}

export const enum CubeMapFace {
  TextureCubeMapPositiveX = 34069,
  TextureCubeMapNegativeX = 34070,
  TextureCubeMapPositiveY = 34071,
  TextureCubeMapNegativeY = 34072,
  TextureCubeMapPositiveZ = 34073,
  TextureCubeMapNegativeZ = 34074
}

export const enum TextureTarget {
  Texture2D = 3553,
  TextureCubeMapPositiveX = 34069,
  TextureCubeMapNegativeX = 34070,
  TextureCubeMapPositiveY = 34071,
  TextureCubeMapNegativeY = 34072,
  TextureCubeMapPositiveZ = 34073,
  TextureCubeMapNegativeZ = 34074
}

export const enum TextureUnit {
  Texture0 = 33984,
  Texture1 = 33985,
  Texture2 = 33986,
  Texture3 = 33987,
  Texture4 = 33988,
  Texture5 = 33989,
  Texture6 = 33990,
  Texture7 = 33991,
  Texture8 = 33992,
  Texture9 = 33993,
  Texture10 = 33994,
  Texture11 = 33995,
  Texture12 = 33996,
  Texture13 = 33997,
  Texture14 = 33998,
  Texture15 = 33999,
  Texture16 = 34000,
  Texture17 = 34001,
  Texture18 = 34002,
  Texture19 = 34003,
  Texture20 = 34004,
  Texture21 = 34005,
  Texture22 = 34006,
  Texture23 = 34007,
  Texture24 = 34008,
  Texture25 = 34009,
  Texture26 = 34010,
  Texture27 = 34011,
  Texture28 = 34012,
  Texture29 = 34013,
  Texture30 = 34014,
  Texture31 = 34015
}

export const enum TextureInternalFormat {
  Alpha = 6406,
  RGB = 6407,
  RGBA = 6408,
  Luminance = 6409,
  LuminanceAlpha = 6410,
  DepthComponent = 6402,
  DepthStencil = 34041,
  SRGB = 35904,
  SRGBAlpha = 35906
}

export const enum TextureTexelDataType {
  /** 8 bits per channel for gl.RGBA */
  UnsignedByte = 5121,
  /** 5 red bits, 6 green bits, 5 blue bits */
  UnsignedShort_5_6_5 = 33635,
  /** 4 red bits, 4 green bits, 4 blue bits, 4 alpha bits */
  UnsignedShort_4_4_4_4 = 32819,
  /** 5 red bits, 5 green bits, 5 blue bits, 1 alpha bit */
  UnsignedShort_5_5_5_1 = 32820,
  UnsignedShort = 5123,
  UnsignedInt = 5125,
  UnsignedInt_24_8 = 34042,
  Float = 5126,
  HalfFloat = 36193
}

export const enum RenderbufferType {
  Renderbuffer = 36161
}

export const enum RenderbufferInternalFormat {
  /** 4 red bits, 4 green bits, 4 blue bits 4 alpha bits. */
  RGBA4 = 32854,
  /** 5 red bits, 5 green bits, 5 blue bits, 1 alpha bit. */
  RGB5_A1 = 32855,
  /** 5 red bits, 6 green bits, 5 blue bits. */
  RGB565 = 36194,
  /** 16 depth bits. */
  DepthComponent16 = 33189,
  /** 8 stencil bits. */
  StencilIndex8 = 36168,
  DepthStencil = 34041
}

export const enum RenderbufferParameter {
  Width = 36162,
  Height = 36163,
  InternalFormat = 36164,
  RedSize = 36176,
  GreenSize = 36177,
  BlueSize = 36178,
  AlphaSize = 36179,
  DepthSize = 36180,
  StencilSize = 36181
}

export const enum FramebufferAttachmentType {
  ColorAttachment0 = 36064,
  DepthAttachment = 36096,
  StencilAttachment = 36128
}

export const enum FramebufferAttachmentParameter {
  ObjectType = 36048,
  ObjectHandle = 36049,
  TextureLevel = 36050,
  CubeMapFace = 36051,
  TextureLayer = 36052,
  ColorEncoding = 33296,
  ComponentType = 33297,
  RedSize = 33298,
  GreenSize = 33299,
  BlueSize = 33300,
  AlphaSize = 33301,
  DepthSize = 33302,
  StencilSize = 33303
}

export const enum FramebufferAttachmentObjectType {
  Renderbuffer = 36161,
  Texture = 5890,
  None = 0
}

export const enum FramebufferAttachmentComponentType {
  Float = 5126,
  Int = 5124,
  UnsignedInt = 5125,
  SignedNormalized = 36764,
  UnsignedNormalized = 35863
}

export const enum FramebufferAttachmentColorEncoding {
  Linear = 9729,
  SRGB = 35904
}

export const enum StencilOperation {
  /** Keeps the current value. */
  Keep = 7680,
  /** Sets the stencil buffer value to 0. */
  Zero = 0,
  /** Sets the stencil buffer value to the reference value as specified by WebGLRenderingContext.stencilFunc(). */
  Replace = 7681,
  /** Increments the current stencil buffer value. Clamps to the maximum representable unsigned value. */
  Increment = 7682,
  /**
   * Increments the current stencil buffer value. Wraps stencil buffer value to
   * zero when incrementing the maximum representable unsigned value.
   */
  IncrementWrap = 34055,
  /** Decrements the current stencil buffer value. Clamps to 0. */
  Decrement = 7683,
  /**
   * Decrements the current stencil buffer value. Wraps stencil buffer value to the maximum
   * representable unsigned value when decrementing a stencil buffer value of 0.
   */
  DecrementWrap = 34056,
  /** Inverts the current stencil buffer value bitwise. */
  Invert = 5386
}

export const enum StencilFunction {
  /** Never pass. */
  Never = 512,
  /** Pass if (ref & mask) <  (stencil & mask). */
  Less = 513,
  /** Pass if (ref & mask) =  (stencil & mask). */
  Equal = 514,
  /** Pass if (ref & mask) <= (stencil & mask). */
  LessOrEqual = 515,
  /** Pass if (ref & mask) >  (stencil & mask). */
  Greater = 516,
  /** Pass if (ref & mask) != (stencil & mask). */
  NotEqual = 517,
  /** Pass if (ref & mask) >= (stencil & mask). */
  GreaterOrEqual = 518,
  /** Never pass. */
  Always = 519
}

export const enum WindingOrientation {
  Clockwise = 2304,
  CounterClockwise = 2305
}

export const enum HintMode {
  DontCare = 4352,
  Fastest = 4353,
  Nicest = 4354
}

export const enum ColorspaceConversionMode {
  BrowserDefault = 37444,
  None = 0
}

export const enum ContextParameter {
  AlphaBits = 3413,
  RedBits = 3410,
  GreenBits = 3411,
  BlueBits = 3412,
  SubpixelBits = 3408,
  ActiveTextureUnit = 34016,
  AliasedLineWidthRange = 33902,
  AliasedPointSizeRange = 33901,
  ArrayBufferBinding = 34964,
  BlendDestinationAlpha = 32970,
  BlendDestinationRGB = 32968,
  BlendEquation = 32777,
  BlendEquationAlpha = 34877,
  BlendEquationRGB = 32777,
  BlendSourceAlpha = 32971,
  BlendSourceRGB = 32969,
  Blend = 3042,
  BlendColor = 32773,
  ColorClearValue = 3106,
  ColorWritemask = 3107,
  CompressedTextureFormats = 34467,
  CullFace = 2884,
  CullFaceMode = 2885,
  CurrentProgram = 35725,
  DepthBits = 3414,
  DepthClearValue = 2931,
  DepthFunction = 2932,
  DepthRange = 2928,
  DepthTest = 2929,
  DepthWritemask = 2930,
  ElementArrayBufferBinding = 34965,
  Dither = 3024,
  FramebufferBinding = 36006,
  FrontFace = 2886,
  GenerateMipmapHint = 33170,
  LineWidth = 2849,
  MaxTextureImageUnits = 34930,
  MaxCombinedTextureImageUnits = 35661,
  MaxCubeMapTextureSize = 34076,
  MaxRenderbufferSize = 34024,
  MaxTextureSize = 3379,
  MaxVaryingVectors = 36348,
  MaxVertexAttributes = 34921,
  MaxVertexTextureImageUnits = 35660,
  MaxVertexUniformVectors = 36347,
  MaxViewportDimensions = 3386,
  /** Packing of pixel data into memory */
  PackAlignment = 3333,
  PolygonOffsetFactor = 32824,
  PolygonOffsetFill = 32823,
  PolygonOffsetUnits = 10752,
  RenderbufferBinding = 36007,
  Renderer = 7937,
  SampleBuffers = 32936,
  SampleCoverageInvert = 32939,
  SampleCoverageValue = 32938,
  Samples = 32937,
  ScissorBox = 3088,
  ScissorTest = 3089,
  ShadingLanguageVersion = 35724,
  StencilBits = 3415,
  StencilClearValue = 2961,
  StencilTest = 2960,
  StencilFail = 2964,
  StencilFunction = 2962,
  StencilRef = 2967,
  StencilValueMask = 2963,
  StencilWritemask = 2968,
  StencilBackFail = 34817,
  StencilBackFunction = 34816,
  StencilBackRef = 36003,
  StencilBackValueMask = 36004,
  StencilBackWritemask = 36005,
  StencilPassDepthFail = 2965,
  StencilPassDepthPass = 2966,
  StencilBackPassDepthFail = 34818,
  StencilBackPassDepthPass = 34819,
  TextureBinding2D = 32873,
  TextureBindingCubeMap = 34068,
  /** Unpacking of pixel data from memory. */
  UnpackAlignment = 3317,
  /** Default color space conversion or no color space conversion. */
  UnpackColorspaceConversion = 37443,
  /** Flips the source data along its vertical axis if true. */
  UnpackFlipY = 37440,
  /** Multiplies the alpha channel into the other color channels */
  UnpackPremultiplyAlpha = 37441,
  Vendor = 7936,
  Version = 7938,
  VertexArrayBinding = 34229,
  Viewport = 2978
}
