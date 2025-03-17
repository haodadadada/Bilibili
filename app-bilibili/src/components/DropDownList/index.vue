<template>
    <div class="container" @mouseleave="handleMouseLeave($event, '.primary-menu')">
        <div class="head iconfont" @mouseover="handleMouseOver($event, '.primary-menu')">
            <span style="margin-right: 10px; white-space: nowrap;">{{ props.title }}</span>
            <span>&#xe65d;</span>
        </div>
        <div class="content-data primary-menu">
            <div v-for="(item, index) of props.list" :key="item.text" class="drop_item" @click="chooseData($event, [index])" @mouseover="handleMouseOver($event, '.secondary-menu' + index, index)"
                @mouseleave="handleMouseLeave($event, '.secondary-menu' + index)">
                {{ item.text }}
                <div v-if="'nextChild' in item && item.nextChild" class="content-data-child" :class="'secondary-menu' + index">
                    <div v-for="(itemSec, indexSec) of item.nextChild.text" :key="itemSec.text" class="drop_item" @click="chooseData($event, [index, indexSec])">
                        {{ itemSec }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, nextTick, onDeactivated} from 'vue';

interface ListItem {
    text: string;
    nextChild?: {
        text: ListItem[];
    };
}

let props = defineProps<{
  list: ListItem[];
  title: string;
}>();
let itemHeight: number = 0;
let emit = defineEmits(['choose-data']);
const handleMouseOver = (event: Event, className: string, index?: number) => {
    if(event) {
        event.stopPropagation;
    }
    let targetEle: HTMLElement | null = document.querySelector(className);
    if(!targetEle) {
        return;
    }
    targetEle.style.height = 'auto';
    targetEle.classList.add('animation-over-content');
    targetEle.classList.remove('animation-back-content');
    targetEle.style.pointerEvents = 'auto';
    if(!(typeof index === 'undefined')) {
        targetEle.style.top = itemHeight * index + 'px';
    };
};

const handleMouseLeave = (event: Event, className: string) => {
    if(event) {
        event.stopPropagation;
    }
    let targetEle: HTMLElement | null = document.querySelector(className);
    if(!targetEle) {
        return;
    }
    targetEle.classList.add('animation-back-content');
    targetEle.classList.remove('animation-over-content');
    targetEle.style.pointerEvents = 'none';
};

const removeEvent = (className: string) => {
    let targetEle: HTMLElement | null = document.querySelector(className);
    if(!targetEle) {
        return;
    }
    targetEle.classList.remove('animation-over-content');
    targetEle.classList.remove('animation-back-content');
    targetEle.style.pointerEvents = 'none';
};

const chooseData = (event: Event, index: number[]) => {
    event.stopPropagation();
    emit('choose-data', {value: index});
};
onMounted(async () => {
    try {
        await nextTick();
        itemHeight = document.querySelector('.drop_item')?.getBoundingClientRect().height || 0;
    }
    catch(err) {
        console.log('drop-height', err);
    }
});

onDeactivated(() => {
    removeEvent('.primary-menu');
});
</script>

<style lang="scss" scoped>
/* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
@font-face {
  font-family: 'iconfont';  /* Project id 4460636 */
  src: url('//at.alicdn.com/t/c/font_4460636_xs19tkw4ixm.woff2?t=1710070637367') format('woff2'),
       url('//at.alicdn.com/t/c/font_4460636_xs19tkw4ixm.woff?t=1710070637367') format('woff'),
       url('//at.alicdn.com/t/c/font_4460636_xs19tkw4ixm.ttf?t=1710070637367') format('truetype');
}

.iconfont{
    font-family:"iconfont" !important;
    font-size:16px;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}

.container {
    position: relative;
    margin: 10px 0;
    width: var(--dropdown-list-item-width);
    .head {
        display: flex;
        align-items: center;
        line-height: var(--dropdown-list-head-height);
        margin-left: calc(var(--dropdown-list-item-width) / 2);
        transform: translateX(-50%);
    }
    .content-data {
        position: absolute;
        left: 0;
        z-index: 99;
        opacity: 0;
        pointer-events: none;
        width: var(--dropdown-list-item-width);
        opacity: 0;
    }
    .content-data-child {
        position: absolute;
        left: 100%;
        z-index: 99;
        opacity: 0;
        overflow: hidden;
        pointer-events: none;
        width: var(--dropdown-list-item-width);
    }
    .animation-over-content {
        animation: content-over-animation .5s;
        animation-fill-mode: forwards;
        animation-timing-function: ease-in-out;
    }
    .animation-back-content {
        animation: content-back-animation .5s;
        animation-fill-mode: forwards;
        animation-timing-function: ease-in-out;
    }
    @keyframes content-over-animation {
        0% {
            opacity: 0;
        }
    
        100% {
            opacity: 1;
        }
    }
    @keyframes content-back-animation {
        0% {
            opacity: 1;
        }
    
        100% {
            opacity: 0;
        }
    }
    .drop_item {
        padding: 10px 30px;
        background-color: #000;
        color: #fff;
        border-left: 1px solid #6cf;
    }
    .drop_item:hover {
        background-color: pink;
    }
}

</style>