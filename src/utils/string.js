function json2stringCompact(json) {
  return JSON.stringify(json, null, 2)
    .slice(2, -1) // 처음/마지막 괄호 제거 + 첫 줄바꿈 삭제
    .replace(/\,/g, ''); // 쉽표 제거
}
