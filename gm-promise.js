const gm = require('gm');
const https = require('https');
const {Buffer} = require('buffer');
const measure = require('string-pixel-width');

gm.prototype.toBuffer = function(){
  return new Promise((resolve, reject) => {
    this.stream((err, stdout, stderr) => {
      if (err) { return reject(err) }
      const chunks = []
      stdout.on('data', (chunk) => { chunks.push(chunk) })
      // these are 'once' because they can and do fire multiple times for multiple errors,
      // but this is a promise so you'll have to deal with them one at a time
      stdout.once('end', () => { resolve(Buffer.concat(chunks)) })
      stderr.once('data', (data) => { reject(String(data)) })
    })
  })
};

let protoSize = gm.prototype.size;
gm.prototype.size = function() {
  return new Promise((resolve, reject) => {
    protoSize.bind(this)(function(err, size){
      if(err) reject(err);
      resolve(size);
    });
  });
};
gm.prototype.execute = async function(){
  // if(this._out.length == 0 && this._out.length == 0) return this;
  return await gm.fromGM(this);
}

gm.fromGM = async function(data){
  let img = gm(await data.toBuffer());
  img.ext = data.ext;
  return img;
}
gm.fromUrl = async function(url){
  let buffer = await gm.loadImage(url);
  let img = gm(buffer);
  let match = url.match(/\.(\w+)(\?[^#]*)?(#.*)?$/);
  img.ext = match?match[1]:'png';
  return img;
};
gm.loadImage = function(url){
  return new Promise((succ, err) => {
    const req = https.request(url, (res) => {
      if(res.statusCode != 200) return err(res.statusCode);

      let data = [];
      res.on('data', (chunk) => {
        data.push(chunk);
      });
      res.on('end', () => {
        succ(Buffer.concat(data));
      });
    });
    req.on('error', (e) => {
      err(e.message);
    });
    req.end();
  });
}

// Utils
gm.wrapText = function(text, fontSize, width){
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

/* GM Server for sending */
const uuid = require('uuid');
const http = require('http');
const magickserver = new http.Server();
const magickport = 9555;
const magickObjects = {};

magickserver.on('request', async (req, res) => {
  let obj = magickObjects[req.url];
  if(obj) {
    res.writeHead(200, {
      'Content-Type': 'image/'+(obj.ext||'png')
    });
    res.end(await obj.toBuffer());
  }else{
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end("\n");
  }
});
magickserver.listen(magickport, () => {});

gm.prototype.openHttp = function(){
  if(!this._httpids) this._httpids = [];
  let id = uuid.v4();
  this._httpids.push(id);
  magickObjects[`/${id}`] = this;
  return `http://localhost:${magickport}/${id}`;
};
gm.prototype.closeHttp = function(){
  if(!this._httpids || this._httpids.length == 0) return;
  this._httpids.forEach(id => {
    delete magickObjects[`/${id}`];
  });
  this._httpids = [];
};

module.exports = gm;
