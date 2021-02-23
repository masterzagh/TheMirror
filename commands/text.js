const measure = require('string-pixel-width');
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
  let strokeWidth = (fontSize*0.05)|0;
  let margin = size.height*0.025;


  if(topText){
    topText = topText.toUpperCase();
    let fontSizeMult = topText.length>25?1-(100/(topText.length)):1;
    fontSizeMult = fontSizeMult<0.65?0.65:fontSizeMult;
    let topSize = fontSize*fontSizeMult;
    let fontHeight = topSize*0.8;

    img = img.encoding('Unicode')
      .stroke('black', strokeWidth)
      .fill('white')
      .font('./impact/impact.ttf', topSize);

    let lines = wrapText(topText, topSize, size.width);
    lines.forEach((line, i) => {
      img = img.drawText(0, fontHeight + margin + i*fontHeight*1.2, line, 'North');
    });
  }

  if(bottomText){
    bottomText = bottomText.toUpperCase();
    let fontSizeMult = bottomText.length>25?1-(100/(bottomText.length)):1;
    fontSizeMult = fontSizeMult<0.65?0.65:fontSizeMult;
    let botSize = fontSize*fontSizeMult;
    let fontHeight = botSize*0.8;

    img = img.encoding('Unicode')
      .stroke('black', strokeWidth)
      .fill('white')
      .font('./impact/impact.ttf', fontSize);

    let lines = wrapText(bottomText, fontSize, size.width);
    lines.reverse().forEach((line, i) => {
      img = img.drawText(0, margin + i*fontHeight*1.2, line, 'South');
    });
  }

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

function wrapText(text, fontSize, width){
  let lines = [];
  let parts = text.split(' ');
  text = parts.shift();
  for(let i=0;i<parts.length;i++){
    let part = parts[i];
    if(measure(text+' '+part, {size: fontSize}) > width*1.2){
      lines.push(text);
      text = part;
    }else{
      text += ' '+part;
    }
  }
  lines.push(text);
  return lines
}
