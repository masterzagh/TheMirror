module.exports.name = 'mono';
module.exports.aliases = [];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let img = (await gm.fromGM(buffer)).monochrome();
  return img;
};
module.exports.usage = {
  explanation: 'Turns image into monochrome.'
};
