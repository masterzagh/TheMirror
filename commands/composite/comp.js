module.exports.name = 'compose';
module.exports.aliases = ['comp'];
module.exports.call = async function(msg, data, stack, gm){
  let list = stack.fetch(data, 2);
  if(!list) return;

  let compose = data[""][0]||'Over';
  let img = gm(list[0].openHttp())
    .composite(list[1].openHttp())
    .compose(compose)
    // .in('-geometry', '+0+0');
  return img;
};
