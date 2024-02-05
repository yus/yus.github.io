// yusdesign colors, p5*js

let colors;

function setup() {
  let gta = [];
  gta.push(select('.group-title'));
  let gtdivs = selectAll('.group-title'); 
  for (let i = 0; i < gta.length; i += 1) {
    let a = select(gtdivs[i].html());
    gtdivs[i].html('<div class = "lbl"></div>' + a);
  } 
  
  select('.lbl').style('background-image', './images/label_straight_left.svg');
} 
