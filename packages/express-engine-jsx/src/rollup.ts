import { readFileSync } from 'fs';
import {
  rollup,
  RollupBuild,
} from 'rollup';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
// import virtual from 'rollup-plugin-virtual';
import hypothetical from 'rollup-plugin-hypothetical';
import { terser } from 'rollup-plugin-terser';

const isProd: boolean = process.env.NODE_ENV === 'production';
const extensions: string[] = ['.js', '.jsx'];

export default async (input: string, file: string, props: any): Promise<RollupBuild> => {
  const page: string = readFileSync(file).toString();
  const propsString: string = `export default ${JSON.stringify(props)}`

  console.log(page);
  console.log(propsString);

  return await rollup({
    input,
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
      }),
      hypothetical({
        [`${__dirname}/react-ssr-page.js`]: page,
        [`${__dirname}/react-ssr-props.js`]: propsString,
      }),
      nodeResolve({
        extensions,
      }),
      babel({
        extensions,
        exclude: /node_modules/,
        runtimeHelpers: true,
      }),
      commonjs({
        include: /node_modules/,
      }),
      (isProd && terser()),
    ],
  });
}
