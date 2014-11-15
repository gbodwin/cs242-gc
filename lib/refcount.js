var assert = require('assert');
var ll     = require('./low-level');

var HeapObject = ll.HeapObject;
var Ptr        = ll.Ptr;

Ptr.prototype.addref  = function() {
  // Task 3(a){{
    this.deref()._refcount += 1;
  // }}
};

Ptr.prototype.release = function() {
  // Task 3(a){{
    if(!this._free){
	this.deref()._refcount -= 1;
	if(this.deref()._refcount == 0){
	    ll.free(this);
	    if(this.deref().fst != null) this.deref().fst.release();
	    if(this.deref().snd != null) this.deref().snd.release();
	}
    }
  // }}
};

Ptr.prototype.setfst = function(x) {
  assert(ll.isPointer(x));
  // Task 3(b){{
    if(x != null) x.addref();
    if(this.deref().fst != null) this.fst.release();
    this.deref().fst = x;
  // }}
};

Ptr.prototype.setsnd = function(x) {
  assert(ll.isPointer(x));
  // Task 3(b){{
    if(x != null) x.addref();
    if(this.deref().snd != null) this.snd.release();
    this.deref().snd = x;
  // }}
};

Ptr.prototype.withfst = function(f) {
  // Task 3(b){{
    f(this.deref().fst);
  // }}
};

Ptr.prototype.withsnd = function(f) {
  // Task 3(b){{
    f(this.deref().snd);
  // }}
};

function create(fst, snd, f) {
  // Task 3(b){{
    newSpace = ll.malloc();
    newSpace.addref();
    newSpace.setfst(fst);
    newSpace.setsnd(snd);
    f(newSpace);
    newSpace.release();
  // }}
}
exports.create = create;

// Roots

var root = null;

function setroot(ptr) {
  // Task 3(b){{
    ptr.addref();
    if(root != null) root.release();
    root = ptr;
  // }}
}
exports.setroot = setroot;

function withroot(f) {
  // Task 3(b){{
    f(root);
  // }}
}
exports.withroot = withroot;
