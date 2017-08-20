import { u8 } from 'wasm-types';
import { I32, FUNC } from '../value_type';
import { varuint32, varint7 } from '../numbers';
import { emitString } from '../string';
import opcode from '../opcode';
import OutputStream from '../../utils/output-stream';

const emitFunction = (stream, { params, result }) => {
  stream.push(varint7, FUNC, 'func type');
  stream.push(varuint32, params.length, 'parameter count');
  params.forEach(type => stream.push(varint7, type, 'param'));
  if (result)
    stream.push(varint7, result.type, 'result type');
}

const emitter = (functions) => {
  const stream = new OutputStream();
  stream.push(varuint32, functions.length, 'count');

  functions.forEach(index => stream.push(varuint32, index, 'type index'));

  return stream;
};

export default emitter;
