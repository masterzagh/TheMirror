module.exports.name = 'flipv';
module.exports.aliases = ['fv'];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let img = (await gm.fromGM(buffer)).flip();
  return img;
};
module.exports.usage = {
  explanation: 'Flips image vertically.'
};
