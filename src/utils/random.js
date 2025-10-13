'use strict';
// @ts-check

/**
 * 파일위치: /src/utils/random.js
 * 파일명: random.js
 * 용도: 랜덤 관련 유틸리티 함수
 * 기능: 셔플, 랜덤 선택 등
 * 책임: 무작위 관련 공통 로직 제공
 */

/**
 * 배열 셔플 (Fisher-Yates 알고리즘)
 * @param {Array} array - 셔플할 배열
 * @param {boolean} inPlace - 원본 수정 여부
 * @returns {Array}
 */
function shuffleArray(array, inPlace = true) {
  const target = inPlace ? array : [...array];

  for (let i = target.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [target[i], target[j]] = [target[j], target[i]];
  }

  return target;
}

/**
 * 배열에서 랜덤 요소 선택
 * @param {Array} array
 * @returns {*}
 */
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 범위 내 랜덤 정수
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    shuffleArray,
    randomElement,
    randomInt,
  };
}
