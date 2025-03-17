<template>
    <div class="danmaku-container" ref="danmakuContainerRef" v-show="!isClosed"></div>
</template>

<script setup lang="js">
    import { computed, nextTick, ref, watch, onUnmounted } from 'vue';
    import * as R from 'ramda';
    import debounce from '@/utils/common/debounce';
    const props = defineProps(['danmakuScrollList', 'danmakuSetting', 'positionTrigger']);
    const emit = defineEmits(['clearDanmakuScrollList']);
    // 控制弹幕关闭开启
    let isClosed = ref(false);
    const updateClosedState = state => isClosed.value = state;
    let isPaused = ref(false);
    const updatePausedState = state => isPaused.value = state;
    // 弹幕正常速率
    let speed = 0;
    let maxSpeed = 0;
    // 弹幕正常字体大小
    const fontSize = 20;
    const opacity = 1;
    // 弹幕池滚动元素最大数量
    const danmakuRollDomPoolMaxCount = 20;
    // 轨道高度
    let trackHeight = Number(fontSize * props.danmakuSetting.value.danmakuSize) / 100 + 5 || fontSize + 5;
    // 弹幕移动时间不算本体宽度, 用于计算速度
    const movingDuration = 8;
    const minMovingDuration = 5;

    let danmakuRollDomPool = ref([]);
    let danmakuScrollList = computed(() => props.danmakuScrollList);

    let danmakuContainerRef = ref(null);
    let danmakuContainerHeight = 0;
    let danmakuContainerWidth = 0;
    let danmakuContainerRight = 0;
    // 滚动轨道池最大数量
    let maxTracks = 0;
    let tracksPool = ref([]);
    watch(danmakuContainerRef, () => {
        initData();
    }, { once: true });
    const handleUpdateDanmakuSetting = debounce(() => {
        // 更新设置后重新跳转轨道高度
        trackHeight = Number(fontSize * props.danmakuSetting.value.danmakuSize / 100) + 5 || fontSize + 5;
        initData();
    }, 500);
    watch(() => props.danmakuSetting, handleUpdateDanmakuSetting);
    const updateTracksPool = newMaxTracks => {
        const currentTracks = tracksPool.value.length;
        if (newMaxTracks > currentTracks) {
            // 增加轨道
            const additionalTracks = new Array(newMaxTracks - currentTracks).fill().map(() => []);
            tracksPool.value = [...tracksPool.value, ...additionalTracks];
        } else if (newMaxTracks < currentTracks) {
            // 截断轨道
            tracksPool.value = tracksPool.value.slice(0, newMaxTracks);
        };
    };

    const initData = () => {
        danmakuContainerHeight = danmakuContainerRef.value.offsetHeight;
        danmakuContainerWidth = danmakuContainerRef.value.offsetWidth;
        danmakuContainerRight = danmakuContainerRef.value.getBoundingClientRect().right;
        maxTracks = Math.floor(Number(danmakuContainerHeight * props.danmakuSetting.value.danmakuShowArea) / 100 / trackHeight);
        updateTracksPool(maxTracks);
        speed = danmakuContainerWidth / movingDuration;
        maxSpeed = danmakuContainerWidth / minMovingDuration;
    };

    const handleWindowResize = () => {
        initData();
    };
    window.addEventListener('resize', handleWindowResize);
    watch(() => props.positionTrigger, async () => {
        await nextTick();
        initData();
    });
    // 插入滚动弹幕
    const dropRollDanmuku = (danmaku) => {
        if(!danmaku) return false;
        let danmakuDom = danmakuRollDomPool.value.find(danmakuEle => danmakuEle.style.display === 'none');
        // 没有空闲元素则创建
        if(!danmakuDom) {
            if(danmakuRollDomPool.value.length < danmakuRollDomPoolMaxCount) {
                danmakuDom = createDanmukuElement(danmaku);
            }
            // 无空闲元素且池子已满则不创建
            else {
                return false;
            };
        };
        if(!danmakuDom) return false;
        // 先将元素显示以获取宽度
        danmakuDom.style.display = 'flex';
        danmakuDom.innerText = danmaku.content;
        const danmakuDomWidth = danmakuDom.getBoundingClientRect().width;
        // 随机分配弹幕轨道
        const trackIndex = selectRollTrack(tracksPool.value)(danmakuDomWidth);
        // 无可用轨道则退出
        if(trackIndex === -1) {
            danmakuDom.style.display = 'none';
            return false;
        };
        // 计算追及速度
        const track = tracksPool.value[trackIndex];
        // 将初始速度设为正常速度到最大速度之间的随机值
        let catchUpSpeed = Math.random() * (maxSpeed - speed) + speed;
        if(track.length > 0) {
            const previousDanmuku = track[track.length - 1];
            const previousRect = previousDanmuku.getBoundingClientRect();
            const previousSpeed = previousDanmuku.catchUpSpeed;
            catchUpSpeed = previousSpeed * (danmakuContainerWidth + 10) / (previousRect.right + 10);
        };
        const rangeTop = Math.min(catchUpSpeed, maxSpeed);
        catchUpSpeed = Math.random() * (rangeTop - speed) + speed;
        const translateXNum = danmakuContainerWidth + danmakuDomWidth + 10 + 10;
        const duration = translateXNum / catchUpSpeed;
        danmakuDom.style.setProperty('--translateX', `-${translateXNum}px`);
        danmakuDom.style.setProperty('--top', `${trackIndex * trackHeight}px`);
        danmakuDom.style.setProperty('--duration', `${duration}s`);
        danmakuDom.style.setProperty('--offset', `${danmakuContainerWidth + 10}px`);
        danmakuDom.style.setProperty('--fontSize', `${Number(fontSize * props.danmakuSetting.value.danmakuSize) / 100}px`);
        danmakuDom.style.setProperty('--opacity', `${Number(opacity * props.danmakuSetting.value.danmakuOpacity) / 100}`);

        danmakuDom.catchUpSpeed = catchUpSpeed;
        tracksPool.value[trackIndex].push(danmakuDom);
        // 重置动画
        danmakuDom.classList.remove('player-danmaku-roll');
        void danmakuDom.offsetWidth;
        danmakuDom.classList.add('player-danmaku-roll');
        // 配置{once: true}防止同一个元素重绘后多次触发
        danmakuDom.addEventListener('animationend', () => {
            // 动画结束后隐藏
            danmakuDom.style.display = 'none';
            // 从轨道中移除
            tracksPool.value[trackIndex] = tracksPool.value[trackIndex].slice(1);
        }, {once: true});
        return true;
    };
    const createDanmukuElement = (danmaku) => {
        const { content } = danmaku;
        const danmakuDom = document.createElement('div');
        danmakuDom.classList.add('player-danmaku-dm');
        danmakuContainerRef.value.appendChild(danmakuDom);
        danmakuDom.innerText = content;
        const color = intToHexColor(danmaku.color);
        danmakuDom.style = `
            display: flex;
            --opacity: ${Number(opacity * props.danmakuSetting.value.danmakuOpacity) / 100};
            --fontSize: ${Number(fontSize * props.danmakuSetting.value.danmakuSize) / 100}px;
            --fontFamily: SimHei, 'Microsoft JhengHei', Arial, Helvetica, sans-serif;
            --fontWeight: normal;
            --textShadow: 1px 0 1px #000000, 0 1px 1px #000000, 0 -1px 1px #000000, -1px 0 1px #000000;
            --color: ${color};
        `;
        danmakuRollDomPool.value.push(danmakuDom);
        return danmakuDom;
    };
    // 从上到下选择轨道
    const selectRollTrack = R.curry((tracks, danmakuWidth) => {
        return R.findIndex(track => {            
            return R.ifElse(
                R.propEq(0, 'length'),
                R.always(true),
                R.pipe(
                    R.last,
                    R.invoker(0, 'getBoundingClientRect'),
                    // 是轨道最后一个弹幕的rect
                    rect => danmakuContainerRight - rect.right > danmakuWidth,
                )
            )(track);
        })(tracks);
    });

    const closeDanmaku = () => {
        if(isClosed.value) return;
        R.forEach(danmakuRollDom => {
            danmakuRollDom.classList.remove('player-danmaku-roll');
            danmakuRollDom.style.display = 'none';
        }, danmakuRollDomPool.value);
        tracksPool.value = R.map(() => [], tracksPool.value);
        updateClosedState(true);
    };
    const openDanmaku = () => {
        if(!isClosed.value) return;
        updateClosedState(false);
    };
    const pauseDanmaku = () => {
        const danmakuPoll = [...danmakuRollDomPool.value];
        if(isPaused.value) {
            R.forEach(danmaku => {
                if(danmaku.style.display !== 'none') {
                    danmaku.style['animation-play-state'] = 'running';
                };
            }, danmakuPoll);
        }
        else {
            R.forEach(danmaku => {
                if(danmaku.style.display !== 'none') {
                    danmaku.style['animation-play-state'] = 'paused';
                };
            }, danmakuPoll);
        };
        updatePausedState(!isPaused.value);
    };
    const clearDanmakuScrollList = (list, index) => {
        emit('clearDanmakuScrollList', list, index);
    };
    const danmakuLoadedOperate = () => {
        if(danmakuScrollList.value.length === 0) return;
        // 填入弹幕并返回最后一个弹幕索引
        const insertEndIndex = R.findIndex(R.complement(dropRollDanmuku))(danmakuScrollList.value);
        // 返回 -1 表示全部填充
        if(insertEndIndex === -1) clearDanmakuScrollList(danmakuScrollList.value, danmakuScrollList.value.length);
        else if(insertEndIndex !== 0) clearDanmakuScrollList(danmakuScrollList.value, insertEndIndex);
    };

    let timer = null;
    timer = setInterval(() => {
        danmakuLoadedOperate();
    }, 1000);

    // 颜色转换函数
    const intToHexColor = intColor => {
        // 确保输入为有效的颜色值 16777215 是 0xFFFFFF 的十进制值
        if (intColor < 0 || intColor > 16777215) {
            throw new Error('需要传入有效的颜色值.');
        };

        // 提取 RGB 组件
        const r = (intColor >> 16) & 0xff; // 红色分量
        const g = (intColor >> 8) & 0xff;  // 绿色分量
        const b = intColor & 0xff;         // 蓝色分量

        // 将每个颜色通道转换为两位的十六进制字符串
        const hexR = ('0' + r.toString(16)).slice(-2);
        const hexG = ('0' + g.toString(16)).slice(-2);
        const hexB = ('0' + b.toString(16)).slice(-2);

        // 返回组合后的十六进制颜色字符串
        return `#${hexR}${hexG}${hexB}`;
    };

    // 暴露给父组件
    defineExpose({
        openDanmaku,
        closeDanmaku,
        pauseDanmaku
    });

    onUnmounted(() => {
        window.removeEventListener('resize', handleWindowResize);
        if(timer) {
            clearInterval(timer);
            timer = null;
        };
    });
</script>

<style lang="scss" scoped>
    .danmaku-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
<!-- 不加scoped是为了能够获取 js 添加的css变量 -->
<style lang="scss">
    .player-danmaku-dm {
        position: absolute;
        line-height: 1;
        user-select: none;
        white-space: pre;
        perspective: 500px;
        will-change: transform, opacity, top, left;
        font-weight: var(--fontWeight, bold);
        font-family: var(--fontFamily);
        font-size: var(--fontSize, 25px);
        color: var(--color, #ffffff);
        text-shadow: var(--textShadow);
        transform: translateZ(0);
        opacity: var(--opacity, 0);
        display: flex;
        align-items: center;
        height: auto;
        vertical-align: baseline;
    }
    .player-danmaku-roll {
        animation: roll linear var(--duration) forwards;
        top: var(--top, 0);
        left: var(--offset, -10px);
    }
    @keyframes roll {
        0% {
            transform: translateX(0) translateZ(0);
        }
        100% {
            transform: translateX(var(--translateX)) translateZ(0);
        }
    }
    .player-danmaku-top {
        top: 0;
        left: 50%;
        transform: translate(-50%, var(--translateY, 0));
    }
    .player-danmaku-bottom {
        bottom: 0;
        left: 50%;
        transform: translate(-50%, var(--translateY, 0));
    }
    .player-danmaku-fixed {
        animation: fixed linear 6s forwards;
    }
    @keyframes fixed {

    }
</style>