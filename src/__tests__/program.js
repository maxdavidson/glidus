import test from 'ava';
import createRenderingContext from 'gl';
import { createContext } from '..';

const gl = createRenderingContext(640, 480);
const context = createContext(gl, { debug: true });

test('invalid program', t => {
  t.throws(() => context.createProgram());
});

test('create program', t => {
  const vertexShader = context.createVertexShader('void main(void) {}');
  const fragmentShader = context.createFragmentShader('void main(void) {}');
  const program = context.createProgram(vertexShader, fragmentShader);
  t.is(context.bindings[gl.CURRENT_PROGRAM], null);
  program.use();
  t.is(context.bindings[gl.CURRENT_PROGRAM], program);
});
