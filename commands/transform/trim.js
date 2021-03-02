module.exports.name = 'trim';
module.exports.aliases = ['t'];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let fuzz = data[""][0]||'0%';
  if(fuzz[fuzz.length-1] != '%'){
    fuzz = fuzz+'%';
  }
  let img = (await gm.fromGM(buffer)).fuzz(fuzz).trim();
  return img;
};
module.exports.usage = {
  args: ['fuzz%'],
  explanation: 'Trims image.',
  optional: {
    '-fuzz':{
      aliases: ['-f'],
      arg: 'fuzz%',
      explanation: 'Colors within this distance are considered equal. Can be a percentage.'
    },
  }
};
