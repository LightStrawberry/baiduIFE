var Heap;
(function () {
  'use strict';

  Heap = function (cmp) {
    this._heap = [];
    if (typeof cmp === 'function') {
      this._cmp = cmp;
    } else {
      this._cmp = function (a, b) {
        return a - b;
      };
    }
  };

  Heap.prototype._heapify = function (index) {
    var extr = index;
    var left = 2 * index + 1;
    var right = 2 * index + 2;
    var temp;
    if (left < this._heap.length &&
        this._cmp(this._heap[left], this._heap[index]) > 0) {
      extr = left;
    }
    if (right < this._heap.length &&
        this._cmp(this._heap[right], this._heap[index]) > 0) {
      extr = right;
    }
    if (index !== extr) {
      temp = this._heap[index];
      this._heap[index] = this._heap[extr];
      this._heap[extr] = temp;
      this._heapify(extr);
    }
  };
  /**
   * Changes the key.<br><br>
   * Complexity: O(log N).
   *
   * @public
   * @param {Number} index Index of the value which should be changed.
   * @param {Number|Object} value New value according to the index.
   * @return {Number} New position of the element.
   */
  Heap.prototype.changeKey = function (index, value) {
    this._heap[index] = value;
    var elem = this._heap[index];
    var parent = Math.floor(index / 2);
    var temp;
    if (elem !== undefined) {
      while (parent >= 0 && this._cmp(elem, this._heap[parent]) > 0) {
        temp = this._heap[parent];
        this._heap[parent] = elem;
        this._heap[index] = temp;
        index = parent;
        parent = Math.floor(parent / 2);
      }
    }
    return parent;
  };
  /**
   * Updates a given node. This operation is useful
   * in algorithms like Dijkstra, A* where we need
   * to decrease/increase value of the given node.
   *
   * @public
   * @param {Number|Object} node Node which should be updated.
   */
  Heap.prototype.update = function (node) {
    var idx = this._heap.indexOf(node);
    if (idx >= 0) {
      this.changeKey(idx, node);
    }
  };
  /**
   * Adds new element to the heap.<br><br>
   * Complexity: O(log N).
   *
   * @public
   * @param {Number|Object} value Value which will be inserted.
   * @return {Number} Index of the inserted value.
   */
  Heap.prototype.add = function (value) {
    this._heap.push(value);
    return this.changeKey(this._heap.length - 1, value);
  };
  /**
   * Returns current value which is on the top of the heap.<br><br>
   * Complexity: O(1).
   *
   * @public
   * @return {Number|Object} Current top value.
   */
  Heap.prototype.top = function () {
    return this._heap[0];
  };
  /**
   * Removes and returns the current extremum value
   * which is on the top of the heap.<br><br>
   * Complexity: O(log N).
   *
   * @public
   * @returns {Number|Object} The extremum value.
   */
  Heap.prototype.extract = function () {
    if (!this._heap.length) {
      throw 'The heap is already empty!';
    }
    var extr = this._heap.shift();
    this._heapify(0);
    return extr;
  };
  Heap.prototype.getCollection = function () {
    return this._heap;
  };
  /**
   * Checks or heap is empty.
   *
   * @public
   * @returns {Boolean} Returns true if heap is empty.
   */
  Heap.prototype.isEmpty = function () {
    return !this._heap.length;
  };
})(typeof window === 'undefined' ? module.exports : window);
