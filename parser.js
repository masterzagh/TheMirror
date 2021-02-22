const Discord = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const commands = require('./commands');
const gm = require('./gm-promise');

let aliases = {

};
function Parser(){
  this.prefix;

  let stack;
  this.parse = function(content, msg){
    if(!content.startsWith(this.prefix)) return false;
    content = content.substring(this.prefix.length);

    if(content.startsWith('help')){
      let parts = content.split(/\s+/);
      commands.help(parts[1], msg);
      return;
    }else if(content.startsWith('alias')){
      let parts = content.match(/^alias ([^\s]+) (.+)$/);
      if(parts){
        if(!aliases[msg.author.id]) aliases[msg.author.id] = {};
        aliases[msg.author.id][parts[1]] = parts[2].split('|');
        console.log(aliases);
        return;
      }
    }

    stack = new Stack();
    msg.channel.messages.fetch().then(async messages => {
      const filtered = messages.sort((a, b) => b.createdTimestamp - a.createdTimestamp).filter(m => {
        let hasImage = false;
        let images = {
          image: [],
          embed: []
        };
        if(m.attachments.size > 0){
          m.attachments.forEach(a => {
            images.image.push(a.url);
          });
          hasImage = true;
        }
        if(m.embeds.length){
          m.embeds.forEach(e => {
            if(e.type == 'image'){
              images.image.push(e.url);
              hasImage = true;
            }else if(e.image){
              images.embed.push(e.image.url);
              hasImage = true;
            }
          });
        }

        m._images = images;
        return hasImage;
      }).array();

      let bufferData = {
        i: [],
        "": []
      };
      let parts = content.split('|');
      for(let pi=0;pi<parts.length;pi++){
        let part = parts[pi].trim();

        let matches = part.match(/("[^"]+"|[^\s]+)/g);
        let name = matches.shift();

        let data = {
          i: [],
          "": []
        };
        let current;
        for(let mi=0;mi<matches.length;mi++){
          let match = matches[mi];

          // Shorthand -i mention or -i link
          if(
            !current &&
            (
              match.match(/^<@!?(\d+)>$/) ||
              match.match(/^https?:\/\/[^\s]+$/)
            )
          )
            current = 'i';

          if(current){
            if(current == 'i'){
              let url;

              let matchParts = match.match(/(-\d)+(:[^:]+)?(:\d+)?/);
              if(matchParts){
                let msgIndex = +matchParts[1];
                let type, typeIndex;
                if(matchParts[2]) type = matchParts[2].substring(1);
                if(matchParts[3]) typeIndex = +matchParts[3].substring(1);
                if(!isNaN(+type)){
                  typeIndex = +type;
                  type = null;
                }
                if(!typeIndex || isNaN(typeIndex)){
                  typeIndex = 0;
                }

                let iMsg = filtered[-1-msgIndex];
                let images = iMsg._images;
                if(!type){
                  for(let t in images){
                    if(images[t].length){
                      type = t;
                      break;
                    }
                  }
                }
                if(!images[type]) return; //idk

                url = images[type][typeIndex];
                if(!url) return; //idk
              }else if(match.match(/^https?:\/\/[^\s]+$/)){
                url = match;
              }else if(matchParts = match.match(/^<@!?(\d+)>$/)){
                let user = msg.mentions.users.get(matchParts[1]);
                url = user.displayAvatarURL({format: 'png', dynamic: true, size:512});
              }

              if(url){
                let img = await gm.fromUrl(url);
                let index = stack.push(img) - 1;
                match = index;
              }

              data.i.push(match);
            }else if(current == 'ii'){
              let n = +match;

              let urls = [];
              for(let i=0;n>0&&i<filtered.length;i++){
                let iMsg = filtered[i];
                let images = iMsg._images;
                for(let t in images){
                  let imgs = images[t];
                  for(let l=0;l<imgs.length;l++){
                    let img = await gm.fromUrl(imgs[l]);
                    let index = stack.push(img) - 1;
                    data.i.push(index);

                    n--;
                    if(n<=0) break;
                  }
                  if(n<=0) break;
                }
              }

            }else{
              data[current] = cleanQuotes(match);
            }
            current = null;
          }else if(match.startsWith('-')){
            current = match.substring(1);
            if(!isNaN(+match)){
              console.log(match, current);
              data[""].push(match);
              current = null;
            }else if(current.startsWith('-')){
              data[current.substring(1)] = true;
              current = null;
            }
          }else{
            data[""].push(cleanQuotes(match));
          }
        }

        if(stack.length == 0){
          let images = filtered[0]._images;
          for(let t in images){
            if(images[t].length){
              type = t;
              break;
            }
          }
          let url = images[type][0];
          stack.push(await gm.fromUrl(url));
        }

        // Buffer data for next command and inject alias into parts
        if(aliases[msg.author.id] && aliases[msg.author.id][name]){
          parts.splice(pi+1, 0, ...aliases[msg.author.id][name]);
          for(let i in data){
            let d = data[i];
            if(d instanceof Array){
              d.forEach(_ => bufferData[i].push(_));
            }else{
              bufferData[i] = d;
            }
          }
          continue;
        }

        // Add buffered data back to data
        for(let i in bufferData){
          let d = bufferData[i];
          if(d instanceof Array){
            d.forEach(_ => data[i].push(_));
          }else{
            data[i] = d;
          }
        }
        bufferData = {
          i: [],
          "": []
        };

        let img = await commands.run(name, msg, data, stack.duplicate());
        if(img) stack.push(await img.execute());
      }

      // At the end return the last image in the stack
      let img = stack.pop();
    	const attachment = new Discord.MessageAttachment(
        await img.toBuffer(),
        'result.'+(img.ext||'png')
      );
    	msg.channel.send("", attachment);

      // Clean up http objects in case i forget
      stack.forEach(img => img.closeHttp());
      img.closeHttp();
    });
  }

  function Stack(array=[]){
    let stack = array.slice(0);
    stack.duplicate = function(){
      return new Stack(stack);
    }
    // reverse(false): use stack by default unless single is defined (last on stack)
    // reverse(true): use last on stack by default unless stack is defined
    stack.fetch = function(data, size, reverse=false){
      let list = [];
      if(data.i.length >= size){
        return data.i.slice(0, size).map(i => stack[i]);
      }else if((!reverse && !data.single || reverse && data.stack) && stack.length >= size){
        return stack.slice(stack.length-size);
      }else if(!reverse && data.single || reverse && !data.stack){
        let index = stack.length-1;
        if(data.i.length) index = data.i[0];
        let pop = stack[index];
        return Array(size).fill(pop);
      }
      return null;
    };
    stack.fetchSingle = function(data){
      let list = stack.fetch(data, 1);
      if(!list) return null;
      return list[0];
    };
    return stack;
  }
  function getUserFromMention(mention) {
  	if(!mention) return;
  	if(mention.startsWith('<@') && mention.endsWith('>')) {
  		mention = mention.slice(2, -1);
  		if(mention.startsWith('!')) {
  			mention = mention.slice(1);
  		}
  		return client.users.cache.get(mention);
  	}
  }
  function cleanQuotes(text){
    if(text[0] == '"' && text[text.length-1] == '"')
      return text.substring(1, text.length-1);
    return text;
  }
}
module.exports = new Parser();
