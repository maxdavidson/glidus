import test from 'ava';
import createRenderingContext from 'gl';
import { createContext } from '..';

const gl = createRenderingContext(640, 480);
const context = createContext(gl, { debug: true });

test('hello', t => {
  t.true(true);
});
