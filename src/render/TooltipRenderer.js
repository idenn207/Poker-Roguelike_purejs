/**
 * 파일위치: /src/render/TooltipRenderer.js
 * 파일명: TooltipRenderer.js
 * 용도: 툴팁 렌더링 처리
 * 기능: 툴팁 내용 업데이트, 위치 계산, 표시/숨김
 * 책임: 툴팁 동적 렌더링
 */

class TooltipRenderer extends RenderCore {
  constructor() {
    super();

    /** @type {HTMLElement|null} */
    this.tooltipElement = null;

    console.debug("TooltipRenderer initialized");
  }

  /**
   * 초기화
   */
  init() {
    this.tooltipElement = this._draw.getElementById("globalTooltip");

    if (!this.tooltipElement) {
      console.warn("Tooltip element not found");
    }

    console.debug("TooltipRenderer init complete");
  }

  /**
   * 툴팁 렌더링 (상태 기반)
   * @param {UIState.tooltip} tooltipState - UIState.tooltip
   */
  render(tooltipState) {
    if (!this.tooltipElement) return;

    const { isVisible, title, description, position } = tooltipState;

    if (isVisible) {
      // 내용 업데이트
      const titleEl = this._draw.getElementById("tooltipTitle");
      const descEl = this._draw.getElementById("tooltipDescription");

      if (titleEl) this._draw.setText(titleEl, title);
      if (descEl) this._draw.setText(descEl, description);

      // 위치 설정
      this._draw.addStyle(this.tooltipElement, {
        top: `${position.top}px`,
        left: `${position.left}px`,
      });

      // 표시
      this._draw.setDisplay(this.tooltipElement, "block");
    } else {
      // 숨김
      this._draw.setDisplay(this.tooltipElement, "none");
    }
  }

  /**
   * 툴팁 위치 계산
   * @param {HTMLElement} targetElement
   * @returns {{ top:number, left:number, position: 'top'|'bottom' }}
   */
  calculatePosition(targetElement) {
    if (!this.tooltipElement) return { top: 0, left: 0, position: "top" };

    // 툴팁을 화면 밖에 임시로 표시하여 실제 크기 측정
    this._draw.addStyle(this.tooltipElement, {
      visibility: "hidden",
      display: "block",
      top: "-9999px",
      left: "-9999px",
    });

    const targetRect = this._draw.applyFunc(targetElement, "getBoundingClientRect");
    const tooltipRect = this._draw.applyFunc(this.tooltipElement, "getBoundingClientRect");
    const spacing = 12;

    // 타겟의 중앙 X 좌표
    const targetCenterX = targetRect.left + targetRect.width / 2;
    console.log("=================== ACTION ===================");
    console.log("window.innerWidth: ", window.innerWidth);
    console.log("targetRect: ", targetRect);
    console.log("tooltipRect: ", tooltipRect);
    console.log("targetCenterX: ", targetCenterX);

    let top = targetRect.top - tooltipRect.height - spacing;
    let left = targetCenterX - tooltipRect.width / 2; // 툴팁 중앙 정렬
    let position = "top";

    // 위쪽 공간 부족 시 아래쪽으로
    if (top < 0) {
      top = targetRect.bottom + spacing;
      position = "bottom";
    }

    // 좌우 경계 체크
    const minLeft = spacing;
    const maxLeft = window.innerWidth - tooltipRect.width - spacing;

    if (left < minLeft) {
      left = minLeft;
    } else if (left > maxLeft) {
      left = maxLeft;
    }

    // 5. visibility 복원 (render 메서드에서 최종 표시)
    this._draw.addStyle(this.tooltipElement, {
      visibility: "visible",
    });

    return { top, left, position };
  }
}
