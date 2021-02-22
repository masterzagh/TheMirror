module.exports.name = 'rotate';
module.exports.aliases = ['r'];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let angle = +data[""][0];
  let img = (await gm.fromGM(buffer)).rotate('transparent', angle);
  return img;
};
module.exports.usage = {
  args: ['angle'],
  explanation: 'Rotates image by specified angle.'
};
