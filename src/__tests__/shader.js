import test from 'ava';
import createRenderingContext from 'gl';
import { createContext } from '..';

const gl = createRenderingContext(640, 480);
const context = createContext(gl, { debug: true });

test('invalid raw shader', t => {
  t.throws(() => context.createRawShader(0));
  t.throws(() => context.createRawShader(gl.VERTEX_SHADER, ''));
});

test('invalid fragment shader', t => {
  t.throws(() => context.createFragmentShader());
  t.throws(() => context.createFragmentShader(''));
});

test('invalid vertex shader', t => {
  t.throws(() => context.createVertexShader());
  t.throws(() => context.createVertexShader(''));
});
