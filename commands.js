const gm = require('./gm-promise');
const fs = require('fs');

const Discord = require('discord.js');

function Commands(){

  let commands = {};
  let aliases = {};
  let utils = {};
  this.add = function(name, obj){
    commands[name] = obj;
    obj.call = obj.call.bind(obj);
    for(let i in utils){
      obj[i] = utils[i].bind(obj);
    }
  }
  this.alias = function(name, alias){
    aliases[alias] = name;
  }

  this.run = async function(name, ...args){
    if(aliases[name]) name = aliases[name];
    return await commands[name].call(...args, gm);
  }

  this.help = function(name, msg){
    if(aliases[name]) name = aliases[name];
    let cmd = commands[name];
    if(!cmd) return general_help(msg); // TODO later show general help
    let usage = cmd.usage;
    if(!usage) return;

    let value = "";
    if(cmd.usage_cache){
      value = cmd.usage_cache;
    }else{
      value += `Usage: ${name} `
      if(usage.args) value += usage.args.map(a => `<${a}>`).join(' ');
      if(cmd.aliases && cmd.aliases.length) value += '\nAliases: '+cmd.aliases.join(', ');
      if(usage.optional){
        for(let i in usage.optional){
          let o = usage.optional[i];
          value += '\n' + i;
          if(o.aliases) value += ','+o.aliases.join(',');
          if(o.arg) value += ' <'+o.arg+'>';
          if(o.explanation) value += ' : '+o.explanation;
        }
      }
      if(usage.explanation) value += '\n\n'+usage.explanation+'\n\n';
      cmd.usage_cache = value;
    }

    let embed = new Discord.MessageEmbed()
    	.setColor('#00ff99')
    	.setDescription(`\`\`\`\n${value}\n\`\`\``);

    msg.channel.send(embed);
  }

  function general_help(msg){
    let value = `-command <args...> | command <args...> | command <args...>`;
    value += `\n-i <input image>`;
    value += `\n  i<0 image previously sent in channel`;
    value += `\n  i>=0 image in stack`;
    value += `\n  i=link (self-explanatory)`;
    value += `\n  i=mention (uses user's avi)`;
    value += `\n-ii <number>`;
    value += `\n  Pushes the n previously sent images to the stack`;
    value += `\n\nEach command pushes the resulting image to the stack.`;

    let l = [];
    for(let i in commands){
      l.push(i);
    }
    value += '\n\n'+l.join(',');
    let embed = new Discord.MessageEmbed()
    	.setColor('#00ff99')
    	.setDescription(`\`\`\`\n${value}\n\`\`\``);

    msg.channel.send(embed);
  }

  utils.get = function(data, optional, argIndex, defaultValue){
    if(data[optional]) return data[optional];
    if(this.usage.optional && this.usage.optional['-'+optional]){
      let opt = this.usage.optional['-'+optional];
      if(opt.aliases){
        for(let i=0;i<opt.aliases.length;i++){
          let a = opt.aliases[i].substring(1);
          if(data[a]) return data[a];
        }
      }
    }
    if(argIndex !== undefined && data[""][argIndex])
      return data[""][argIndex];
    return defaultValue;
  }
}

let commands = new Commands();
function readDir(dir){
  fs.readdirSync(dir).forEach(file => {
    let f = dir+'/'+file;
    if(fs.lstatSync(f).isDirectory()) return readDir(f);

    if(!f.endsWith('.js')) return;
    let command = require(f);
    commands.add(command.name, command);
    command.aliases.forEach(alias => {
      commands.alias(command.name, alias);
    })
  });
}
readDir('./commands');


// commands.add('col', async function(msg, data, stack){
//   let index = stack.length-1;
//   if(data.i.length) index = data.i[0];
//   let canvas = stack[index];
//
//   let colors = data[""].map(hexToRgb).filter(c => c);
//   let step = 256/colors.length;
//
//   let newCanvas = createCanvas(canvas.width, canvas.height);
//   let ctx = newCanvas.getContext('2d');
//
//   const id = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
//   const array = id.data;
//   for (let i = 0; i < array.length; i += 4) {
//   	let r = array[i];
//   	let g = array[i + 1];
//   	let b = array[i + 2];
//   	let y = 0.299 * r + 0.587 * g + 0.114 * b;
//
//     let color = colors[(y/step)|0];
//   	array[i] = color.r;
//   	array[i + 1] = color.g;
//   	array[i + 2] = color.b;
//   }
//   ctx.putImageData(id, 0, 0);
//
//   return newCanvas;
// });
/* https://stackoverflow.com/a/5624139 */
// function hexToRgb(hex) {
//   // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
//   var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
//   hex = hex.replace(shorthandRegex, function(m, r, g, b) {
//     return r + r + g + g + b + b;
//   });
//
//   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   return result ? {
//     r: parseInt(result[1], 16),
//     g: parseInt(result[2], 16),
//     b: parseInt(result[3], 16)
//   } : null;
// }

module.exports = commands;
