module.exports.name = 'rotate';
module.exports.aliases = ['r'];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let size = await buffer.size();
  let angle = +data[""][0];
  let img = (await gm.fromGM(buffer)).rotate('transparent', angle);
  if(data['maintain']||data['m'])
    img = img.resize(size.width, size.height);
  if(data['crop']||data['c'])
    img = img.gravity('Center').crop(size.width, size.height);
  return img;
};
module.exports.usage = {
  args: ['angle'],
  explanation: 'Rotates image by specified angle.',
  optional: {
    '--maintain':{
      aliases: ['--m'],
      explanation: 'Maintains width and height.'
    },
    '--crop':{
      aliases: ['--c'],
      explanation: 'Crops to width and height.'
    }
  }
};
