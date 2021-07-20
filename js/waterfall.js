(function () {
  // The DOM structure needed to generate the waterfall
  function mockHTML(id) {
    // Generate random numbers with minimum and maximum value ranges
    function getRangeNumber(Min, Max) {
      var range = Max - Min;
      return Min + Math.round(range * Math.random());
    }

    var html = "";
    for (var i = 0; i < 100; i++) {
      var h = getRangeNumber(100, 500);
      html += `<div class="item" style="background:#f00;width:200px;height:${h}px">${i}</div>`;
    }
    var app = document.createElement("div");
    app.id = id;
    app.style.margin = "100px auto";
    app.style.width = "1200px";
    app.style.position = "relative";
    app.innerHTML = html;
    document.body.appendChild(app);
  }

  /**
   * Waterfall
   * @param {*} options {columns, gap, el}
   */
  function Waterfall(options) {
    if (!(this instanceof Waterfall)) {
      throw new ReferenceError("Waterfall must be used as a constructor");
    }

    if (!options.el) {
      throw new ReferenceError("the options must contain the el option");
    }

    this.el = document.querySelector(options.el);
    this.columns = options.columns || 5;
    this.gap = options.columns || 10;
    this.itemWidth = this.el.offsetWidth - (this.gap * this.columns - 1);
    this.itemWidth = Math.ceil(this.itemWidth / this.columns);
    this.items = this.el.querySelectorAll(".item");
    this.render();
  }

  /**
   * render the doms
   */
  Waterfall.prototype.render = function () {
    var item;
    var firstLineItemsHeight = [];
    var minItemIndex = -1;

    // Get the index of the smallest value in the array
    function getMinValueIndex(array) {
      var minVal = Math.min.apply(null, array);
      return array.indexOf(minVal);
    }

    for (var i = 0, l = this.items.length; i < l; i++) {
      item = this.items[i];
      item.style.position = "absolute";
      item.style.width = this.itemWidth + "px";

      if (i < this.columns) {
        // first line items
        firstLineItemsHeight.push(item.offsetHeight);
        item.style.top = "0px";
        item.style.left = i * (this.itemWidth + this.gap) + "px";
      } else {
        // other line items
        minItemIndex = getMinValueIndex(firstLineItemsHeight);
        item.style.top = firstLineItemsHeight[minItemIndex] + this.gap + "px";
        item.style.left = this.items[minItemIndex].offsetLeft + "px";
        firstLineItemsHeight[minItemIndex] += item.offsetHeight + this.gap;
      }
    }
  };

  window.Waterfall = Waterfall;
  window.mockHTML = mockHTML;
})();
