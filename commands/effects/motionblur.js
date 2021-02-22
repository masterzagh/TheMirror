module.exports.name = 'motionblur';
module.exports.aliases = ['mblur', 'motion'];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let angle = +data[""][0]||0;
  let radius = +data[""][1]||20;
  if(angle < 0) angle = (angle % 360) + 360;
  let img = (await gm.fromGM(buffer)).motionBlur(radius, radius, angle);
  return img;
};
module.exports.usage = {
  args: ['angle', 'radius'],
  explanation: 'Applies motion blur with the specified arguments.'
};
