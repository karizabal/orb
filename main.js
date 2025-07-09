import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let projection;
let path;
let spherePath;
let graticulePath;
let eyes;
let axesPoints = [];
let headTimer = null;
let dispPoints = null;

/* RENDER HEAD */
function renderHead(containerSelector) {
  d3.select(containerSelector).selectAll('svg').remove();

  const svg = d3
    .select(containerSelector)
    .append('svg')
    .attr('viewBox', '0 0 400 400')
    .style('width', '100%')
    .style('height', 'auto');

  //   let rotation;
  //   if (currentView === 'top') rotation = [0, -90, 0];
  //   else if (currentView === 'side') rotation = [90, 0, 0];
  //   else rotation = [0, 0, 0];

  projection = d3
    .geoOrthographic()
    .scale(150)
    .translate([200, 200])
    // .rotate(rotation)
    .clipAngle(90);

  path = d3.geoPath(projection);

  const defs = svg.append('defs');
  const grad = defs
    .append('linearGradient')
    .attr('id', 'shade')
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', 200)
    .attr('y1', 0)
    .attr('x2', 200)
    .attr('y2', 400);

  grad.append('stop').attr('offset', '10%').attr('stop-color', '#FFF9C4');
  grad.append('stop').attr('offset', '90%').attr('stop-color', '#FDD835');

  const g = svg.append('g');

  spherePath = g
    .append('path')
    .datum({ type: 'Sphere' })
    .attr('d', path)
    .attr('fill', 'url(#shade)')
    .attr('stroke', '#666')
    .attr('stroke-width', 1);

  graticulePath = g
    .append('path')
    .datum(d3.geoGraticule()())
    .attr('d', path)
    .attr('fill', 'none')
    .attr('stroke', '#666')
    .attr('stroke-width', 0.5);

  eyes = g
    .selectAll('circle.eye')
    .data([
      [-25, 10],
      [25, 10],
    ])
    .join('circle')
    .attr('class', 'eye')
    .attr('r', 15)
    .attr('fill', '#333')
    .attr('cx', (d) => projection(d)[0])
    .attr('cy', (d) => projection(d)[1]);
}

renderHead('#head');

const maxYaw = 10;
const maxPitch = 8;
let targetYaw = 0;
let targetPitch = 0;
let currentYaw = 0;
let currentPitch = 0;

function handleMouse(event) {
  const svg = d3.select('#head svg');
  const svgNode = svg.node();
  const [mx, my] = d3.pointer(event, svgNode);
  const { width, height } = svgNode.getBoundingClientRect();
  const cx = width / 2;
  const cy = height / 2;

  targetYaw = -((cx - mx) / cx) * maxYaw;
  targetPitch = -((my - cy) / cy) * maxPitch;

  // currentYaw = targetYaw;
  // currentPitch = targetPitch;
}

window.addEventListener('mousemove', handleMouse);

d3.timer(() => {
  currentYaw += (targetYaw - currentYaw) * 0.1;
  currentPitch += (targetPitch - currentPitch) * 0.1;
  projection.rotate([currentYaw, currentPitch]);
  spherePath.attr('d', path);
  graticulePath.attr('d', path);
  eyes.attr('cx', (d) => projection(d)[0]).attr('cy', (d) => projection(d)[1]);
});
