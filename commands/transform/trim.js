module.exports.name = 'trim';
module.exports.aliases = ['t'];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let img = (await gm.fromGM(buffer)).trim();
  return img;
};
module.exports.usage = {
  explanation: 'Trims image.'
};
