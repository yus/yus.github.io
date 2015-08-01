var s = Snap("#svg");
s = Snap(800, 600);

var bigCircle = s.circle(150, 150, 100);

bigCircle.attr({
    fill: "#bada55",
    stroke: "#000",
    strokeWidth: 5
});

var smallCircle = s.circle(100, 150, 70);

var discs = s.group(smallCircle, s.circle(200, 150, 70));

discs.attr({
    fill: "#fff"
});

bigCircle.attr({
    mask: discs
});

smallCircle.animate({r: 50}, 1000);

discs.select("circle:nth-child(2)").animate({r: 50}, 1000);

