var assert = require('assert');
var util   = require('util');
var ll     = require('./low-level');

var HeapObject = ll.HeapObject;
var Ptr        = ll.Ptr;

Ptr.prototype.setfst = function(x) {
  assert(ll.isPointer(x));
  this.deref().fst = x;
};

Ptr.prototype.setsnd = function(x) {
  assert(ll.isPointer(x));
  this.deref().snd = x;
};

Ptr.prototype.withfst = function(f) {
  // Task 4(a) {{
    root.stack.push(this.deref().fst);
    f(this.deref().fst);
    root.stack.pop();
  // }}
};

Ptr.prototype.withsnd = function(f) {
  // Task 4(a) {{
    root.stack.push(this.deref().snd);
    f(this.deref().snd);
    root.stack.pop();
  // }}
};

function create(fst, snd, f) {
  // Task 4(a) {{
    var newSpace = ll.malloc();
    newSpace.setfst(fst);
    newSpace.setsnd(snd);
    root.stack.push(newSpace);
    f(newSpace);
    root.stack.pop();
  // }}
}
exports.create = create;

// Roots

var root = { root: null, stack: [] };

function setroot(ptr) {
  assert(ll.isPointer(ptr));
  root.root = ptr;
}
exports.setroot = setroot;

function withroot(f) {
  // Task 4(a) {{
    root.stack.push(root);
    f(root);
    root.stack.pop();
  // }}
};
exports.withroot = withroot;

exports.showRoots = function () {
  var a = root.stack.map(function(e) { return e.toString() });
  return util.format('[%s%s%s]', root.root ? root.root : ''
                             , (root.root && a.length > 0) ? ',' : ''
                             , a);
}

// GC

function mark() {
  // Task 4(b) {{
    var markrec = function(ptr){
	if(!ptr.deref()._traced){
	    ptr.deref()._traced = true;
	    if(ptr.deref().fst != null) markrec(ptr.deref().fst);
	    if(ptr.deref().snd != null) markrec(ptr.deref().snd);
	}
    }
    if(root.root != null) markrec(root.root);
    for(var i = 0; i < root.stack.length; i++){
	markrec(root.stack[i]);
    }
  // }}
}
exports.mark = mark;

function sweep() {
  ll.heapIterate(function (ptr) {
  // Task 4(b) {{
      if(ptr.deref()._traced){
	  ptr.deref()._traced = false;
      }
      else if(!ptr.deref()._free){
	  ll.free(ptr);
      }
  // }}
  });
}
exports.sweep = sweep;

function gc() {
  mark();
  sweep();
}
exports.gc = gc;

/* Task 4(c):



*/
