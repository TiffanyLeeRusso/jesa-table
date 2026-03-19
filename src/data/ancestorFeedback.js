// data/ancestorFeedback.js
export const feedback = {
  perfect: [
    "조상님들이 흐뭇하게 웃으십니다. 잘 차렸다, 얘야.",
    "향이 구름처럼 피어오릅니다. 조상님들이 기뻐하십니다.",
    "이렇게 정성스럽게 차리다니. 복을 내려주마.",
  ],
  okay: [
    "조상님들이 고개를 끄덕이십니다. 그래도 먹을 만하구나.",
    "음... 정성은 가상하나, 다음엔 더 잘 해보거라.",
    "부족하지만, 마음은 받겠다.",
  ],
  wth: [
    "이게 뭐냐. 제삿상이 이래서야 되겠느냐.",
    "조상님들이 눈살을 찌푸리십니다. 다시 해라.",
    "아이고... 이 집안은 어찌 이렇단 말이냐.",
  ],
};

export function getFeedback(percentage) {
  const tier = percentage === 100 ? 'perfect' : percentage >= 60 ? 'okay' : 'wth';
  const pool = feedback[tier];
  return {
    tier,
    message: pool[Math.floor(Math.random() * pool.length)],
  };
}
