module.exports.name = 'suck';
module.exports.aliases = [];
module.exports.call = async function(msg, data, stack, gm){
  return gm.fromGM(gm(__dirname+'/files/suck.jpg')); // Subsequent commands won't work without this
};
module.exports.usage = {
  args: [],
  explanation: 'Shows suck.',
};
