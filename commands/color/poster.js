module.exports.name = 'poster';
module.exports.aliases = [];
module.exports.call = async function(msg, data, stack, gm){
  let buffer = stack.fetchSingle(data);
  if(!buffer) return;

  let {width, height} = await buffer.size();
  let colors = data[""];
  let percentage = 100/colors.length;

  let out;
  for(let i=0;i<colors.length;i++){
    let color = colors[i];
    let p = (percentage*(i+1)) + '%';
    let img = await (await gm.fromGM(buffer))
      .normalize()
      .colorspace('GRAY')
      .level(p, p, p)
      .fill('transparent')
      .opaque('white');

    let c = await gm(width, height, color)
      .composite(img.openHttp())
      .compose('In')
      .execute();

    if(i==0) out = c;
    else out = await c.composite(out.openHttp()).compose('Over').execute();
    out.closeHttp();
  }
  return out;
};
module.exports.usage = {
  args: ['color...'],
  explanation: 'Posterizes image with specified colors from darkest to lightest.'
};
