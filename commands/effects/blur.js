module.exports.name = 'blur';
module.exports.aliases = [];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let radius = +data[""][0]||0;
  let img = (await gm.fromGM(buffer)).blur(radius, 10);
  return img;
};
module.exports.usage = {
  args: ['radius'],
  explanation: 'Applies blur with specified radius.'
};
