module.exports.name = 'edge';
module.exports.aliases = [];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let radius = +data[""][0]||1;
  let img = (await gm.fromGM(buffer)).edge(radius);
  return img;
};
module.exports.usage = {
  args: ['radius'],
  explanation: 'Applies edge detection with specified radius.'
};
