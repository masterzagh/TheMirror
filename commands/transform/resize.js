module.exports.name = 'resize';
module.exports.aliases = [];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let width = +(data.width||data.w||data[""][0])||null;
  let height = +(data.height||data.h||data[""][1])||null;
  let force = data.f?'!':null;
  let img = (await gm.fromGM(buffer))
    .resize(width, height, force);
  return img;
};
module.exports.usage = {
  args: ['width', 'height'],
  explanation: 'Resizes image to fit into a box of the specified dimensions.',
  optional: {
    '-width':{
      aliases: ['-w'],
      arg: 'width'
    },
    '-height':{
      aliases: ['-h'],
      arg: 'height'
    },
    '--f':{
      explanation: 'Force into width and height'
    }
  }
};
