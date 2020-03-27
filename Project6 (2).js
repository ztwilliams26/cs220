class Tree{
  
  constructor(nodePt, parentTree){
    this.node = nodePt;
    this.parent = parentTree;
    this.children = [];
  }


  nearest(p){
    let d = distance(this.node, p);
    let best = this;
    for (let i = 0; i < this.children.length; ++i) {
      let other = this.children[i].nearest(p);
      if (distance(other.node, p) < d) {
        best = other;
        d = distance(other.node, p);
      }
    }
    return best;
  }
  
  extend(p, maxExtension){
    let d = distance(this.node, p);
    if (d < maxExtension) {
      return p;
    }

    else {
      let f = maxExtension / d;
      return new geometry.Point(this.node.x + f * (p.x - this.node.x), this.node.y + f * (p.y - this.node.y));
    }
  }

  add(p){
    let cur = this;
    this.children.push(new Tree(p, cur));
  }

}


function distance(p1, p2){
  return Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2));
}

function samplePoint(mapSize, goal, goalBias){
  const r = Math.random();
  if (r < goalBias) {
    return new geometry.Point(goal.x, goal.y);
  }
  return new geometry.Point(mapSize * Math.random(), mapSize * Math.random());
}

function collides(map, p1, p2){
  let collides = false;
  for(let i=0; i<map.length; ++i){
    let l = new geometry.Line(p1, p2);
    if(geometry.intersects(l,map[i])){
      collides = true;
    }
  }
  return collides;
}

function getPath(leaf,goal){
  let cur=leaf;
  let path = [goal];
  while(cur!==null){
    path.push(cur.node);
    cur=cur.parent;
  }
  return path;
}

function plan(start, goal, map, options){
  let root = new Tree(start, null);
  for(let i=0; i<options.maxSamples; ++i){
    let newPt = samplePoint(options.mapSize, goal, options.goalBias);
    let oldPt = root.nearest(newPt);
    let newExtended = oldPt.extend(newPt, options.maxExtension);

    if(!collides(map, oldPt.node, goal)){
      return reverse(getPath(oldPt, goal));
    }
    if(!collides(map, oldPt.node, newExtended)){
      oldPt.add(newExtended);
    }
    options.callback(newPt,oldPt,newExtended,root);

    
  }
  return [];
}

function reverse(revArray){
  let returnArray = [];
  for(let i=0; i<revArray.length; ++i){
    returnArray.push(revArray[revArray.length-(i+1)]);
  }
  return returnArray;
}

function visuallyInspectSampling() {
let mapSize = 400;
let c = lib220.newCanvas(mapSize, mapSize);
let goal = new geometry.Point(100, 100);
let goalBias = 0.1;
for (let i = 0; i < 10000; ++i) {
lib220.sleep(10);
let p = samplePoint(mapSize, goal, goalBias);
if (p.x === goal.x && p.y === goal.y) {
c.drawFilledCircle(p.x, p.y, 2, [1, 0, 0]);
} else {
c.drawFilledCircle(p.x, p.y, 2, [0, 0, 1]);
}
}
}

function visuallyInspectPlan(start, goal, map, options){
  let mapSize = 400;
  let c = lib220.newCanvas(mapSize, mapSize);
  for(let i = 0; i<map.length; ++i){
    c.drawLine(map[i].p1.x,map[i].p1.y, map[i].p2.x, map[i].p2.y, [0,0,0]);
  }
  let visualCallback = function(sampPoint, closeNode, extendPoint, treeRoot){
    lib220.sleep(5);
    
    if (sampPoint.x === goal.x && sampPoint.y === goal.y) {
      c.drawFilledCircle(sampPoint.x, sampPoint.y, 2, [1, 0, 0]);
    } else {
      c.drawFilledCircle(sampPoint.x, sampPoint.y, 1, [0, 0, 1]);
    }
    
    if(collides(map, closeNode.node, extendPoint)){
      c.drawLine(closeNode.node.x, closeNode.node.y, extendPoint.x, extendPoint.y, [1,0,0]);
    }
    else{
      c.drawLine(closeNode.node.x, closeNode.node.y, extendPoint.x, extendPoint.y, [0,0,1]);
    }
  }
  options.callback = visualCallback;
  let success = plan(start, goal, map, options);
  for(let i = 1; i<success.length; ++i){
    c.drawLine(success[i-1].x,success[i-1].y, success[i].x,success[i].y, [0,1,0]);
  }
  return success;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let startPt = new geometry.Point(23,23);
let goalPt = new geometry.Point(39,250);
let emptyCallback = function(sampPoint, closeNode, extendPoint, treeRoot) {};
let options = {
mapSize: 400,
maxExtension: 50,
goalBias: 0.05,
maxSamples: 100000,
callback: emptyCallback
};
let map = [
new geometry.Line(new geometry.Point(0, 0),
new geometry.Point(0, 400)),
new geometry.Line(new geometry.Point(400, 400),
new geometry.Point(0, 400)),
new geometry.Line(new geometry.Point(400, 400),
new geometry.Point(400, 0)),
new geometry.Line(new geometry.Point(400, 0),
new geometry.Point(0, 0)),
new geometry.Line(new geometry.Point(0, 200),
new geometry.Point(300, 200)),
new geometry.Line(new geometry.Point(0, 100),
new geometry.Point(200, 100)),
new geometry.Line(new geometry.Point(300, 100),
new geometry.Point(400, 100)),
new geometry.Line(new geometry.Point(100, 200),
new geometry.Point(100, 300)),
new geometry.Line(new geometry.Point(200, 300),
new geometry.Point(200, 400)),
new geometry.Line(new geometry.Point(300, 300),
new geometry.Point(400, 300)),

];

let emptyMap = [
new geometry.Line(new geometry.Point(0, 0),
new geometry.Point(0, 400)),
new geometry.Line(new geometry.Point(0, 0),
new geometry.Point(400, 0)),
new geometry.Line(new geometry.Point(400, 0),
new geometry.Point(400, 400)),
new geometry.Line(new geometry.Point(0, 4000),
new geometry.Point(400, 400))
]