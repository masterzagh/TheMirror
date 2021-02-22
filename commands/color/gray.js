module.exports.name = 'grayscale';
module.exports.aliases = ['gray', 'grey'];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let img = (await gm.fromGM(buffer)).colorspace('GRAY');
  return img;
};
module.exports.usage = {
  explanation: 'Turns image into grayslace.'
};
