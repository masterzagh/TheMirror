module.exports.name = 'gif';
module.exports.aliases = [];
module.exports.call = async function(msg, data, stack, gm){
  let list = [];
  if(data.stack) list = stack;
  else list = data.i.map(i => stack[i]);
  if(!list || list.length == 0) return;

  let loop = +this.get(data, 'loop', 0, 0);
  let delay = +this.get(data, 'delay', 1, 30);
  let img = gm(list.shift().openHttp()).delay(delay).setFormat('GIF');
  if(loop) img = img.loop(loop);

  list.forEach(l => {
    img = img.in(l.openHttp());
  });

  img.ext = 'gif';
  return img;
};
module.exports.usage = {
  args: ['loop', 'delay'],
  explanation: 'Creates gif from specified images.',
  optional: {
    '-loop':{
      aliases: ['-l'],
      arg: 'loop'
    },
    '-delay':{
      aliases: ['-d'],
      arg: 'delay'
    },
    '--stack':{
      explanation: 'Use images from the entire stack.'
    }
  }
};
