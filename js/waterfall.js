(function () {
  // generate html
  function mockHTML(id) {
    function getRangeNumber(min, max) {
      return min + Math.round(max - min * Math.random());
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

    // 获取数组中最小值的索引
    function getMinValueIndex(array) {
      var minVal = Math.min.apply(null, array);
      return array.indexOf(minVal);
    }

    for (var i = 0, l = this.items.length; i < l; i++) {
      item = this.items[i];
      item.style.position = "absolute";
      item.style.width = this.itemWidth + "px";

      if (i < this.columns) {
        // 第一行
        firstLineItemsHeight.push(item.offsetHeight);
        item.style.top = "0px";
        item.style.left = i * (this.itemWidth + this.gap) + "px";
      } else {
        // 后面其他行
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
