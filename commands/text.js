module.exports.name = 'text';
module.exports.aliases = ['txt'];
module.exports.call = async function(msg, data, stack, gm){
  let imgStack = stack.fetchSingle(data);
  if(!imgStack) return;

  let topText = this.get(data, 'top', 0);
  let bottomText = this.get(data, 'bottom', 1);

  let size = await imgStack.size();
  let img = await gm.fromGM(imgStack);

  let fontSize = (size.width*0.1)|0;
  let fontHeight = fontSize*0.8;
  let strokeWidth = (fontSize*0.05)|0;
  let margin = size.height*0.025;

  if(topText)
    img = img.encoding('Unicode')
      .stroke('black', strokeWidth)
      .fill('white')
      .font('./impact/impact.ttf', fontSize)
      .drawText(0, fontHeight + margin, topText.toUpperCase(), 'North');

  if(bottomText)
    img = img.encoding('Unicode')
      .stroke('black', strokeWidth)
      .fill('white')
      .font('./impact/impact.ttf', fontSize)
      .drawText(0, margin, bottomText.toUpperCase(), 'South');

  return img;
};
module.exports.usage = {
  args: ['top text', 'bottom text'],
  explanation: 'Adds text to image.',
  optional: {
    '-top':{
      aliases: ['-t'],
      arg: 'top text'
    },
    '-bottom':{
      aliases: ['-bot', '-b'],
      arg: 'bottom text'
    }
  }
};
