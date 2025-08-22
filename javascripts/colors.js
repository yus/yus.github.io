// yusdesign colors, p5*js

let colors = [];
let gta = [];

function setup() {
  if(elt.hasClass('group_title'))
    colors.push(select(this.html()));
    console.log(colors);
    gta.push(select(this));
  //let gtdivs = selectAll('.group-title');
  for (let i = 0; i < gta.length; i += 1) {
    let a = select(gta[i]);
    a.html('<div class = "lbl"></div>', true);
  }
  let labelbg = './images/label_straight_left.svg';
  select('lbl').style('background-image', labelbg);
}
