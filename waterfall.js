/**
 * 判断是否一格html元素对象
 * @param {any} obj
 * @returns {Boolean}
 */
function isElement(obj) {
  try {
    return obj instanceof HTMLElement;
  } catch (e) {
    return (
      typeof obj === "object" &&
      obj.nodeType === 1 &&
      typeof obj.style === "object" &&
      typeof obj.ownerDocument === "object"
    );
  }
}

/**
 * 获取数组中最小数字的索引
 * @param {Array} array
 * @returns {Number}
 */
function getMinValueIndex(array) {
  var minVal = Math.min.apply(null, array);
  return array.indexOf(minVal);
}

/**
 * 瀑布流
 */
class Waterfall {
  constructor(options) {
    this.options = Object.assign(
      {
        container: null,
        itemClassName: "item",
        columns: 5,
        gap: 10,
        autoRender: true,
        itemWidth: 0,
      },
      options
    );

    const { gap, columns, container, autoRender } = this.options;
    if (!isElement(container)) {
      throw new TypeError("'container' option must be a HTMLElement");
    }

    // 必须让容器元素定位, 然后子元素才能绝对定位
    container.style.position = "relative";

    // 减去空隙宽度, 然后计算没一列宽度
    const maxWidth = container.offsetWidth - gap * (columns - 1);
    this.options.itemWidth = Math.floor(maxWidth / columns);

    // 是否需要立即渲染设置 items 的位置
    autoRender && this.render();
  }

  // 渲染: 设置 items 的位置
  render() {
    const { itemClassName, gap, columns, itemWidth } = this.options;
    const items = document.getElementsByClassName(itemClassName);
    const line1ItemHeights = []; // first line items heights

    let item, minHeightIdx;
    for (var i = 0, l = items.length; i < l; i++) {
      item = items[i];
      item.style.position = "absolute";
      item.style.width = itemWidth + "px";

      if (i < columns) {
        // fisrt line items
        line1ItemHeights.push(item.offsetHeight);
        item.style.top = "0px";
        item.style.left = i * (itemWidth + gap) + "px";
      } else {
        // other items
        minHeightIdx = getMinValueIndex(line1ItemHeights);
        item.style.left = items[minHeightIdx].offsetLeft + "px";
        item.style.top = line1ItemHeights[minHeightIdx] + gap + "px";
        line1ItemHeights[minHeightIdx] += item.offsetHeight + gap;
      }
    }
  }
}
