module.exports.name = 'create';
module.exports.aliases = ['c'];
module.exports.call = async function(msg, data, stack, gm){
  let width = +data[""][0]||256;
  let height = +data[""][1]||256;
  let color = data[""][2]||'white';

  let img = gm(width, height, color).setFormat('PNG');
  img.ext = 'PNG';

  return gm.fromGM(img); // Subsequent commands won't work without this
};
module.exports.usage = {
  args: ['width', 'height', 'color'],
  explanation: 'Creates image of specified dimensions and background color.',
};
