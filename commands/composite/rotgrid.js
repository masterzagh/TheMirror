module.exports.name = 'rotgrid';
module.exports.aliases = [];
module.exports.call = async function(msg, data, stack, gm){
  let grid = stack.fetch(data, 4, true);
  if(!grid) return;

  // grid[0] = await grid[0].rotate(0).execute();
  grid[1] = await grid[1].rotate('transparent', 90).execute();
  grid[2] = await grid[2].rotate('transparent', 270).execute();
  grid[3] = await grid[3].rotate('transparent', 180).execute();

  let sizes = [];
  sizes.push(await grid[0].size());
  sizes.push(await grid[1].size());
  sizes.push(await grid[2].size());
  sizes.push(await grid[3].size());

  let top = Math.max(sizes[0].height, sizes[1].height);
  let left = Math.max(sizes[0].width, sizes[2].width);

  let width = Math.max(
    grid[0].width + grid[1].width,
    grid[2].width + grid[3].width
  );
  let height = Math.max(
    grid[0].height + grid[2].height,
    grid[1].height + grid[3].height
  );

  let img = gm().in('-background', 'transparent')
    .in('-page', `+${left-sizes[0].width}+${top-sizes[0].height}`)
    .in(grid[0].openHttp())
    .in('-page', `+${left}+${top-sizes[1].height}`)
    .in(grid[1].openHttp())
    .in('-page', `+${left-sizes[2].width}+${top}`)
    .in(grid[2].openHttp())
    .in('-page', `+${left}+${top}`)
    .in(grid[3].openHttp())
    .mosaic()
    .setFormat(grid[0].ext);

  img.ext = grid[0].ext;

  return img;
};
module.exports.usage = {
  args: ['width', 'height'],
  explanation: 'Creates a 2x2 grid with specified images rotating each 90º around central point. By default it uses the last image 4 times.',
  optional: {
    '--stack':{
      explanation: 'Force it to use last 4 in stack.'
    }
  }
};
