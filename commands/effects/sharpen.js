module.exports.name = 'sharpen';
module.exports.aliases = ['sharp'];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let radius = +data[""][0]||0;
  let img = (await gm.fromGM(buffer)).sharpen(radius, 10);
  return img;
};
module.exports.usage = {
  args: ['radius'],
  explanation: 'Applies sharpen with specified radius.'
};
