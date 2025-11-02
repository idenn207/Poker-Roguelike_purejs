/**
 * 파일위치: /src/ui/hud/Tooltip.js
 * 파일명: Tooltip.js
 * 용도: 툴팁 정적 UI 생성
 * 기능: 툴팁 DOM 구조만 생성
 * 책임: 툴팁 HTML 요소 생성 (렌더링은 TooltipRenderer가 담당)
 */

class Tooltip extends UICore {
  constructor() {
    super();

    console.debug("Tooltip Initialized");
  }

  /**
   * 툴팁 DOM 생성 (정적)
   * @returns {HTMLElement}
   */
  create() {
    const tooltip = this._draw.createElement("div", "global-tooltip");
    this._draw.setId(tooltip, "globalTooltip");
    this._draw.setDisplay(tooltip, "none");

    const title = this._draw.createElement("div", "tooltip-title");
    this._draw.setId(title, "tooltipTitle");

    const description = this._draw.createElement("div", "tooltip-description");
    this._draw.setId(description, "tooltipDescription");

    this._draw.appendChild(tooltip, title);
    this._draw.appendChild(tooltip, description);

    this._draw.appendChild(document.body, tooltip);

    console.debug("Tooltip DOM created");

    return tooltip;
  }
}
