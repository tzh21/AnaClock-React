var amtPerSec = 3075.64;

var margin = {
	top: 40,
	right: 40,
	bottom: 40,
	left: 40
}

var radians = 0.0174532925;

var r = 200;

var secR = r + 16;
var hourR = r - 40;

var hourHandLength = 2 * r/3;
var minuteHandLength = r;
var secondHandLength = r - 12;

var w = d3.select('figure').node().clientWidth - margin.left - margin.right;
var h = d3.select('figure').node().clientHeight - margin.top - margin.bottom;

var minuteScale = secondScale = d3.scale.linear()
	.range([0,354])
	.domain([0,59]);

var hourScale = d3.scale.linear()
	.range([0,330])
	.domain([0,11]);

var drag = d3.behavior.drag()
	.on('dragstart', dragstart)
	.on('drag', drag)
	.on('dragend', dragend);

var handData = [
	{
		type:'hour',
		value:0,
		length:-hourHandLength,
		scale:hourScale
	},
	{
		type:'minute',
		value:0,
		length:-minuteHandLength,
		scale:minuteScale
	},
	{
		type:'second',
		value:0,
		length:-secondHandLength,
		scale:secondScale
	}
];

function updateData(){
	var t = new Date();
	handData[0].value = (t.getHours() % 12) + t.getMinutes()/60 ;
	handData[1].value = t.getMinutes();
	handData[2].value = t.getSeconds();
}

updateData();

var svg = d3.select('svg')
	.attr('width', w + margin.left + margin.right)
	.attr('height', h + margin.top + margin.bottom);

var g = svg.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var face = g.append('g')
	.attr('transform', 'translate(' + r + ',' + r + ')');

face.append('circle')
	.attr({
		class: 'outline',
		r: r,
		cx: 0,
		cy: 0,
		fill: '#a0a0a0'
	});

face.selectAll('.second')
	.data(d3.range(0, 60))
.enter().append('line')
	.attr({
		class: 'second',
		x1: 0,
		x2: 0,
		y1: r,
		y2: r - 10,
		transform: function(d) {
			return 'rotate(' + minuteScale(d) + ')';
		}
	});

face.selectAll('.second-label')
	.data(d3.range(5,61,5))
.enter().append('text')
	.classed('.second-label', true)
	.text(function(d) { return d; })
	.attr({
		'text-anchor': 'middle',
		x: function(d) {
			return secR * Math.sin(secondScale(d) * radians);
		},
		y: function(d) {
			return -secR * Math.cos(secondScale(d) * radians) + 8;
		},
		fill: 'white'
	});

face.selectAll('.hour')
	.data(d3.range(0, 12))
.enter().append('line')
	.attr({
		class: 'hour',
		x1: 0,
		x2: 0,
		y1: r,
		y2: r - 20,
		transform: function(d) {
			return 'rotate(' + hourScale(d) + ')';
		}
	});

face.selectAll('.hour-label')
	.data(d3.range(3, 13, 3))
.enter().append('text')
	.text(function(d) { return d; })
	.attr({
		class: 'hour-label',
		'text-anchor': 'middle',
		x: function(d) {
			return hourR * Math.sin(hourScale(d) * radians);
		},
		y: function(d) {
			return -hourR * Math.cos(hourScale(d) * radians) + 9;
		},
		fill: 'white',
		'font-size': 20
	});

var hands = face.append('g');

hands.selectAll('line')
	.data(handData)
.enter().append('line')
	.attr({
		class: function(d) { return d.type + '-hand'; },
		x1: 0,
		y1: 0,
		x2: function(d) {
			return d.length * Math.cos(d.value);
		},
		y2: function(d) {
			return d.length * Math.sin(d.value);
		}
	})
	.call(drag);

// small circle in middle to cover hands
face.append('circle')
	.attr({
		cx: 0,
		cy: 0,
		r: 15,
		fill: 'white',
		'stroke': '#374140',
		'stroke-width': 3
	});

function dragstart() {
}

function drag() {
	
	var rad = Math.atan2(d3.event.y, d3.event.x);
	
	d3.select(this)
		.attr({
			x2: function(d) {
				return r * Math.cos(rad);
			},
			y2: function(d) {
				return r * Math.sin(rad);
			}
		});
}

function dragend() {
}
