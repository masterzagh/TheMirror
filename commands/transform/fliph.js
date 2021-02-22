module.exports.name = 'fliph';
module.exports.aliases = ['fh'];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let img = (await gm.fromGM(buffer)).flop();
  return img;
};
module.exports.usage = {
  explanation: 'Flips image horizontally.'
};
