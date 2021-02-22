module.exports.name = 'overlay';
module.exports.aliases = ['over'];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let color = data[""][0]||'black';
  let percent = data[""][1]||'50%';
  let {width, height} = await buffer.size();
  let overlay = await gm(width, height, color)
    .setFormat('PNG')
    .execute();
  let img = gm(buffer.openHttp())
    .composite(overlay.openHttp())
    .dissolve(percent);
  return img;
};
module.exports.usage = {
  args: ['color', 'opacity%'],
  explanation: 'Overlays a color with specified opacity over image.'
};
