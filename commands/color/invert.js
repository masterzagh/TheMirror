module.exports.name = 'invert';
module.exports.aliases = ['inv'];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let img = (await gm.fromGM(buffer)).negative();
  return img;
};
module.exports.usage = {
  explanation: 'Inverts colors.'
};
