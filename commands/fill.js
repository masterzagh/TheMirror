module.exports.name = 'fill';
module.exports.aliases = ['f'];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let color = data[""][0]||'white';
  let {width, height} = await buffer.size();

  let img = gm(width, height, color).setFormat('PNG');
  img.ext = 'PNG';

  return gm.fromGM(img); // Subsequent commands won't work without this
};
module.exports.usage = {
  args: ['color'],
  explanation: 'Creates an image of the same size as the specified image and of the specified background color.',
};
