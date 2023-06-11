/**
 * 解析歌词
 */
function parseLrc() {
  return lyric.split('\n').map((item) => {
    const parsedLrc = item.split(']');
    const timeStr = parsedLrc[0].substring(1);
    const obj = { time: parseTime(timeStr), words: parsedLrc[1] || '' };
    return obj;
  });
}

/**
 * 解析歌词时间
 */
function parseTime(timeStr) {
  const timeArr = timeStr.split(':');
  return timeArr[0] * 60 + timeArr[1] * 1;
}

const lrcData = parseLrc();

/**
 * 获取需要的dom
 */
const doms = {
  audio: document.querySelector('audio'),
  ul: document.querySelector('ul.lrc-list'),
  container: document.querySelector('.container')
};

/**
 * 计算出当前高亮歌词的索引 index
 */
function findIndex() {
  const currentPlayTime = doms.audio.currentTime;
  const currentPlayIndex = lrcData.findIndex((item) => currentPlayTime < item.time) - 1;
  if (currentPlayIndex === -2) {
    return lrcData.length - 1;
  }
  return currentPlayIndex;
}

/**
 * 界面
 * 创建歌词元素 渲染
 */
(function createLrcElement() {
  const frag = document.createDocumentFragment();

  lrcData.forEach((item) => {
    const li = document.createElement('li');
    li.innerText = item.words;
    frag.appendChild(li);
  });
  doms.ul.appendChild(frag);
})();

/**
 * 容器高度
 */
const containerHeight = doms.container.clientHeight;
/**
 * li的高度
 */
const liHeight = doms.ul.children[0].clientHeight;
/**
 * 最大偏移量
 */
const maxOffset = doms.ul.clientHeight - doms.container.clientHeight;

/**
 * 设置 ul 偏移量
 */
function setOffset() {
  const index = findIndex();
  // 偏移量 = 播放歌词的高度距离顶部 + li高度的一半 - 容器高度的一半
  let offset = liHeight * index + liHeight / 2 - containerHeight / 2;
  if (offset < 0) {
    offset = 0;
  }
  if (offset > maxOffset) {
    offset = maxOffset;
  }
  if (document.querySelector('li.active')) {
    document.querySelector('li.active').classList.remove('active');
  }
  doms.ul.children[index].classList.add('active');
  doms.ul.style.transform = `translateY(-${offset}px)`;
}

doms.audio.addEventListener('timeupdate', setOffset);
