import debounce from './common/debounce';
import type { Ref } from 'vue';
interface ContainerOptions {
  containerRef? : Ref<HTMLElement | null>,
  isFirst?: boolean
};

interface ContentOptions {
  contentRef? : Ref<HTMLElement | null>,
  isFirst?: boolean
};
// 设置容器高度
function setContainerHeight({containerRef}: { containerRef: Ref<HTMLElement | null> }) {
  if(containerRef.value) {
    // 如果后续会添加子元素可能会改变高度
    containerRef.value.style.height = 'auto';
    // 浏览器可用工作区域高度
    const innerHeight = window.innerHeight;
    const bodyHeight = document.body.clientHeight;
    if(innerHeight >= bodyHeight) {
      containerRef.value.style.height = '100vh';
    }
    else {
      containerRef.value.style.height = '100%';
    };
  };
};

const debounceFunHeight = debounce(setContainerHeight, 250);
const debounceSetContainerHeight = function(options: ContainerOptions) {
  const containerRef = 'containerRef' in options ? options.containerRef : null;
  if('isFirst' in options) {
    const { isFirst } = options;
    if(isFirst) {
      setContainerHeight({containerRef: containerRef as Ref<HTMLElement | null> });
      return;
    };
  };
  debounceFunHeight({containerRef: containerRef as Ref<HTMLElement | null>});
};

function setContainerWidth({contentRef}: { contentRef: Ref<HTMLElement | null> }) {
  try {
    if(window.innerWidth >= 1900 && contentRef.value) {
      const marginData = (window.innerWidth - 1840) / 2;
      contentRef.value.style.setProperty('margin-left', `${marginData}px`);
      contentRef.value.style.setProperty('margin-right', `${marginData}px`);
    }
    else if(contentRef.value) {
      contentRef.value.style.setProperty('margin-left', '40px');
      contentRef.value.style.setProperty('margin-right', '40px');
    };
  } catch(err) {
    console.log('error', err);
  };
};
// 使用变量去接收防抖函数
const debounceFunWidth = debounce(setContainerWidth, 250);

// 二次封装 用于配置是否需要立即执行
const debounceSetContainerWidth = function(options: ContentOptions) {
  const contentRef = 'contentRef' in options ? options.contentRef : null;
  if('isFirst' in options) {
    const { isFirst } = options;
    if(isFirst) {
      setContainerWidth({contentRef: contentRef as Ref<HTMLElement | null>});
      return;
    };
  };
  debounceFunWidth({contentRef: contentRef as Ref<HTMLElement | null>});
};
export {
  debounceSetContainerHeight,
  debounceSetContainerWidth
};
