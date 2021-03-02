module.exports.name = 'demo';
module.exports.aliases = [];
module.exports.call = async function(msg, data, stack, gm){
  let imgStack = stack.fetchSingle(data);
  if(!imgStack) return;

  let topText = this.get(data, 'top', 0);
  let bottomText = this.get(data, 'bottom', 1);

  let size = await imgStack.size();
  let side = size.width * 0.2;
  let sidex = (side/2)|0;
  let img = (await (await gm.fromGM(imgStack))
    .background('white')
    .extent(size.width + 2, size.height + 2 , `-${1}-${1}`)
    .execute())

  let fontSize = (size.width*0.1)|0;
  let strokeWidth = (fontSize*0.05)|0;
  let margin = size.height*0.025;

  let topLines;
  let bottomLines;

  let startBottom = size.height + side;
  let endBottom = startBottom;
  let bottom = 0;
  if(topText){
    topText = topText.toUpperCase();
    let fontSizeMult = topText.length>25?1-(100/(topText.length)):1;
    fontSizeMult = fontSizeMult<0.65?0.65:fontSizeMult;
    let topSize = fontSize*fontSizeMult;
    let fontHeight = topSize*0.8;

    topLines = gm.wrapText(topText, topSize, size.width);
    topLines.fontHeight = fontHeight;
    topLines.topSize = topSize;

    startBottom = size.height + side + fontHeight + topLines.length*fontHeight*1.2;
    bottom += (topLines.length+1)*fontHeight*1.2;
  }

  if(bottomText){
    bottomText  = bottomText[0].toUpperCase() + bottomText.substring(1);
    let botSize = fontSize*0.5;
    let fontHeight = botSize*0.8;

    bottomLines = gm.wrapText(bottomText, botSize, size.width);
    bottomLines.fontHeight = fontHeight;
    bottomLines.botSize = botSize;

    endBottom = startBottom + bottomLines.length*fontHeight*1.2;
    bottom += (bottomLines.length+1)*fontHeight*1.2;
  }

  img = img.background('black')
    .extent(size.width + side, size.height + side + bottom, `-${sidex}-${sidex}`);

  if(topLines){
    img = img.encoding('Unicode')
      .fill('white')
      .font('./fonts/times.ttf', topLines.topSize);

    topLines.forEach((line, i) => {
      img = img.drawText(0, size.height + side + topLines.fontHeight + i*topLines.fontHeight*1.2, line, 'North');
    });
  }
  if(bottomLines){
    img = img.encoding('Unicode')
      .fill('white')
      .font('./fonts/arial.ttf', bottomLines.botSize);

    bottomLines.forEach((line, i) => {
      img = img.drawText(0, startBottom + i*bottomLines.fontHeight*1.2, line, 'North');
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
