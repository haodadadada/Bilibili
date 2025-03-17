<template>
    <div class="danmuku-container" ref="danmukuContainerRef" v-show="!isClosed"></div>
</template>

<script setup lang="js">
    import { nextTick, ref, watch, onUnmounted } from 'vue';
    import { useStore } from 'vuex';
    import * as R from 'ramda';
    import debounce from '@/utils/common/debounce';
    import dmProto from '@/assets/proto/dm.json';
    import encWbi from '@/utils/wrid';
    import protobuf from 'protobufjs/light';
    import { getDmList } from '@/api/home';
    const props = defineProps(['playerVideoInfo', 'curPlayerTime', 'danmakuSetting', 'positionTrigger']);
    const store = useStore();
    const sessdata = store.state.userModule.sessdata || '';

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
    const danmukuRollDomPoolMaxCount = 20;
    // 顶部弹幕池
    const danmukuTopDomPoolMaxCount = 3;
    // 底部弹幕池
    const danmukuBottomDomPoolMaxCount = 3;
    // 顶部轨道池 数量与弹幕池相同
    const tracksTopPool = new Array(danmukuTopDomPoolMaxCount).fill().map(() => ({'danmuku': null}));
    const tracksBottomPool = new Array(danmukuBottomDomPoolMaxCount).fill().map(() => ({'danmuku': null}));
    // 轨道高度
    let trackHeight = Number(fontSize * props.danmakuSetting.value.danmakuSize) / 100 + 5 || fontSize + 5;
    // 弹幕移动时间不算本体宽度, 用于计算速度
    const movingDuration = 8;
    const minMovingDuration = 5;

    let danmukuRollDomPool = ref([]);
    let danmukuTopDomPool = ref([]);
    let danmukuBottomDomPool = ref([]);

    let danmukuContainerRef = ref(null);
    let danmukuContainerHeight = 0;
    let danmukuContainerWidth = 0;
    let danmukuContainerRight = 0;
    // 滚动轨道池最大数量
    let maxTracks = 0;
    let tracksPool = ref([]);
    watch(danmukuContainerRef, () => {
        initData();
    }, {once: true});
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
        danmukuContainerHeight = danmukuContainerRef.value.offsetHeight;
        danmukuContainerWidth = danmukuContainerRef.value.offsetWidth;
        danmukuContainerRight = danmukuContainerRef.value.getBoundingClientRect().right;
        maxTracks = Math.floor(Number(danmukuContainerHeight * props.danmakuSetting.value.danmakuShowArea) / 100 / trackHeight);
        updateTracksPool(maxTracks);
        speed = danmukuContainerWidth / movingDuration;
        maxSpeed = danmukuContainerWidth / minMovingDuration;
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
    const dropRollDanmuku = (danmuku) => {
        if(!danmuku) return false;
        let danmukuDom = danmukuRollDomPool.value.find(danmukuEle => danmukuEle.style.display === 'none');
        // 没有空闲元素则创建
        if(!danmukuDom) {
            if(danmukuRollDomPool.value.length < danmukuRollDomPoolMaxCount) {
                danmukuDom = createDanmukuElement(danmuku);
            }
            // 无空闲元素且池子已满则不创建
            else {
                return false;
            };
        };
        if(!danmukuDom) return false;
        // 先将元素显示以获取宽度
        danmukuDom.style.display = 'flex';
        danmukuDom.innerText = danmuku.content;
        const danmukuDomWidth = danmukuDom.getBoundingClientRect().width;
        // 随机分配弹幕轨道
        const trackIndex = selectRollTrack(tracksPool.value)(danmukuDomWidth);
        // 无可用轨道则退出
        if(trackIndex === -1) {
            danmukuDom.style.display = 'none';
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
            catchUpSpeed = previousSpeed * (danmukuContainerWidth + 10) / (previousRect.right + 10);
        };
        const rangeTop = Math.min(catchUpSpeed, maxSpeed);
        catchUpSpeed = Math.random() * (rangeTop - speed) + speed;
        const translateXNum = danmukuContainerWidth + danmukuDomWidth + 10 + 10;
        const duration = translateXNum / catchUpSpeed;
        danmukuDom.style.setProperty('--translateX', `-${translateXNum}px`);
        danmukuDom.style.setProperty('--top', `${trackIndex * trackHeight}px`);
        danmukuDom.style.setProperty('--duration', `${duration}s`);
        danmukuDom.style.setProperty('--offset', `${danmukuContainerWidth + 10}px`);
        danmukuDom.style.setProperty('--fontSize', `${Number(fontSize * props.danmakuSetting.value.danmakuSize) / 100}px`);
        danmukuDom.style.setProperty('--opacity', `${Number(opacity * props.danmakuSetting.value.danmakuOpacity) / 100}`);

        danmukuDom.catchUpSpeed = catchUpSpeed;
        tracksPool.value[trackIndex].push(danmukuDom);
        // 重置动画
        danmukuDom.classList.remove('player-danmaku-roll');
        void danmukuDom.offsetWidth;
        danmukuDom.classList.add('player-danmaku-roll');
        // 配置{once: true}防止同一个元素重绘后多次触发
        danmukuDom.addEventListener('animationend', () => {
            // 动画结束后隐藏
            danmukuDom.style.display = 'none';
            // 从轨道中移除
            tracksPool.value[trackIndex] = tracksPool.value[trackIndex].slice(1);
        }, {once: true});
        return true;
    };
    const dropTopDanmuku = danmuku => {
        if(!danmuku) return false;
        let danmukuDom = danmukuTopDomPool.value.find(danmukuEle => danmukuEle.style.display === 'none');
        // 没有空闲元素则创建
        if(!danmukuDom) {
            if(danmukuTopDomPool.value.length < danmukuTopDomPoolMaxCount) {
                danmukuDom = createDanmukuElement(danmuku);
            }
            // 无空闲元素且池子已满则不创建
            else {
                return false;
            };
        };
        if(!danmukuDom) return false;
        const trackIndex = selectTopOrBottomTrack(tracksTopPool);
        if(trackIndex === -1) {
            danmukuDom.style.display = 'none';
            return false;
        };
        tracksTopPool[trackIndex].danmuku = danmukuDom;
        danmukuDom.style.display = 'flex';
        danmukuDom.innerText = danmuku.content;
        danmukuDom.style.setProperty('--translateY', `${trackIndex * trackHeight}px`);
        danmukuDom.style.setProperty('--fontSize', `${Number(fontSize * props.danmakuSetting.value.danmakuSize) / 100}px`);
        danmukuDom.style.setProperty('--opacity', `${Number(opacity * props.danmakuSetting.value.danmakuOpacity) / 100}`);
        danmukuDom.classList.add('player-danmuku-top');
        danmukuDom.classList.remove('player-danmaku-fixed');
        void danmukuDom.offsetWidth;
        danmukuDom.classList.add('player-danmaku-fixed');
        danmukuDom.addEventListener('animationend', () => {
            danmukuDom.style.display = 'none';
            tracksTopPool[trackIndex].danmuku = null;
        }, {once: true});
        return true;
    };
    const dropBottomDanmuku = danmuku => {
        if(!danmuku) return false;
        let danmukuDom = danmukuBottomDomPool.value.find(danmukuEle => danmukuEle.style.display === 'none');
        // 没有空闲元素则创建
        if(!danmukuDom) {
            if(danmukuBottomDomPool.value.length < danmukuBottomDomPoolMaxCount) {
                danmukuDom = createDanmukuElement(danmuku);
            }
            // 无空闲元素且池子已满则不创建
            else {
                return false;
            };
        };
        if(!danmukuDom) return false;
        const trackIndex = selectTopOrBottomTrack(tracksBottomPool);
        if(trackIndex === -1) {
            danmukuDom.style.display = 'none';
            return false;
        };
        tracksBottomPool[trackIndex].danmuku = danmukuDom;
        danmukuDom.style.display = 'flex';
        danmukuDom.innerText = danmuku.content;
        danmukuDom.style.setProperty('--translateY', `-${trackIndex * trackHeight}px`);
        danmukuDom.style.setProperty('--fontSize', `${Number(fontSize * props.danmakuSetting.value.danmakuSize) / 100}px`);
        danmukuDom.style.setProperty('--opacity', `${Number(opacity * props.danmakuSetting.value.danmakuOpacity) / 100}`);

        danmukuDom.classList.add('player-danmuku-bottom');
        danmukuDom.classList.remove('player-danmaku-fixed');
        void danmukuDom.offsetWidth;
        danmukuDom.classList.add('player-danmaku-fixed');
        danmukuDom.addEventListener('animationend', () => {
            danmukuDom.style.display = 'none';
            tracksTopPool[trackIndex].danmuku = null;
        }, {once: true});
        return true;
    };
    const dropDanmuku = danmuku => {
        const { mode, progress } = danmuku;
        // 如果弹幕进度大于当前播放时间则不填充
        if(progress > (props.curPlayerTime + 1) * 1000) {
            return false;
        };
        if(mode === 1 || mode === 2 || mode === 3) {
            return dropRollDanmuku(danmuku);
        }
        else if(mode === 4) {
            return dropBottomDanmuku(danmuku);
        } 
        else if(mode === 5) {
            return dropTopDanmuku(danmuku);
        }
        else {
            return false;
        };
    };
    const createDanmukuElement = (danmuku) => {
        const { content, mode } = danmuku;
        const danmukuDom = document.createElement('div');
        danmukuDom.classList.add('player-danmaku-dm');
        danmukuContainerRef.value.appendChild(danmukuDom);
        danmukuDom.innerText = content;
        const color = intToHexColor(danmuku.color);
        danmukuDom.style = `
            display: flex;
            --opacity: ${Number(opacity * props.danmakuSetting.value.danmakuOpacity) / 100};
            --fontSize: ${Number(fontSize * props.danmakuSetting.value.danmakuSize) / 100}px;
            --fontFamily: SimHei, 'Microsoft JhengHei', Arial, Helvetica, sans-serif;
            --fontWeight: normal;
            --textShadow: 1px 0 1px #000000, 0 1px 1px #000000, 0 -1px 1px #000000, -1px 0 1px #000000;
            --color: ${color};
        `;
        if(mode === 1 || mode === 2 || mode === 3) {
            danmukuRollDomPool.value.push(danmukuDom);
        }
        else if(mode === 4) {
            danmukuBottomDomPool.value.push(danmukuDom);
        }
        else if(mode === 5) {
            danmukuTopDomPool.value.push(danmukuDom);
        }
        else {
            return null;
        };
        return danmukuDom;
    };
    // 从上到下选择轨道
    const selectRollTrack = R.curry((tracks, danmukuWidth) => {
        return R.findIndex(track => {            
            return R.ifElse(
                R.propEq(0, 'length'),
                R.always(true),
                R.pipe(
                    R.last,
                    R.invoker(0, 'getBoundingClientRect'),
                    // 是轨道最后一个弹幕的rect
                    rect => danmukuContainerRight - rect.right > danmukuWidth,
                )
            )(track);
        })(tracks);
    });

    const selectTopOrBottomTrack = R.curry((tracks) => R.findIndex((R.propEq(null, 'danmuku')))(tracks));
    let curIndex = 0;
    // 监听播放器并更新弹幕
    let stopWatchPlayerTime = null;
    const watchPlayer = () => {
        if(stopWatchPlayerTime) return;
        stopWatchPlayerTime = watch(() => props.curPlayerTime, (curPlayerTime) => {
            if(!danmukuContainerRef.value) return;
            danmakuLoadedOperate(curPlayerTime);
        });
    };
    watchPlayer();
    const closeDanmaku = () => {
        if(isClosed.value) return;
        if(stopWatchPlayerTime) {
            stopWatchPlayerTime();
            stopWatchPlayerTime = null;
        };
        R.forEach(danmukuRollDom => {
            danmukuRollDom.classList.remove('player-danmaku-roll');
            danmukuRollDom.style.display = 'none';
        }, danmukuRollDomPool.value);
        R.forEach(danmakuTopDom => {
            danmakuTopDom.classList.remove('player-danmuku-top');
            danmakuTopDom.style.display = 'none';
        }, danmukuTopDomPool.value);
        R.forEach(danmakuBottomDom => {
            danmakuBottomDom.classList.remove('player-danmuku-bottom');
            danmakuBottomDom.style.display = 'none';
        }, danmukuBottomDomPool.value);
        tracksPool.value = R.map(() => [], tracksPool.value);
        updateClosedState(true);
    };
    const openDanmaku = () => {
        if(!isClosed.value) return;
        watchPlayer();
        updateClosedState(false);
    };
    const pauseDanmaku = () => {
        const danmakuPoll = [...danmukuRollDomPool.value, ...danmukuTopDomPool.value, ...danmukuBottomDomPool.value];
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
    const danmakuLoadedOperate = (curPlayerTime) => {
        if(curIndex >= dmList.value.length || curIndex == -1) return;
        // 填入弹幕并且返回填入状态的相反值
        const dropRollDanmukuAndGetStatus = R.complement(dropDanmuku);
        // 填入弹幕并查找第一个未完成的弹幕索引 返回-1则全部弹幕已被填充
        const nextIndex = R.pipe(
            R.slice(curIndex, Infinity),
            R.findIndex(dropRollDanmukuAndGetStatus)
        )(dmList.value);
        
        // 如果有未完成的弹幕，更新 `curIndex`
        if (nextIndex !== -1) {
            curIndex += nextIndex;
            
            const lastingIndex = findLastingIndex(curPlayerTime, curIndex);
            // 根据找到的索引来更新 `curIndex`
            if(lastingIndex > 0) {
                // 查找比 `curPlayerTime` 更晚的第一个弹幕索引, 跳过这一秒剩余的弹幕
                const adjustmentIndex = findLaterIndex(curPlayerTime, curIndex);
                if(adjustmentIndex > 0) {
                    curIndex += adjustmentIndex;
                };
            }
            // 进度范围超出该弹幕包的范围(通过进度条跳转触发)
            else if(lastingIndex === -1) {
                curIndex = dmList.value.length;
                loadDmList(videoInfo.value);
            };
        }
        else {
            curIndex = dmList.value.length;
            loadDmList(videoInfo.value);
        };
    };

    const resetCurIndex = (curPlayerTime) => {
        if(dmList.value.length === 0) return;
        const lastingIndex = findLastingIndex(curPlayerTime, 0);
        const laterIndex = findLaterIndex(curPlayerTime, 0);
        // 跳转时间点如果不在弹幕包的范围内则退出
        if(lastingIndex === -1 || laterIndex === -1) {
            return;
        }
        else {
            curIndex = laterIndex;
        };
    };

    // 查找比 `curPlayerTime` 更晚的下一秒的弹幕索引, 跳过这一秒剩余的弹幕
    const findLaterIndex = (playerTime, index) => R.pipe(
        R.slice(index, Infinity),
        R.findIndex(
            R.propSatisfies(
                R.both(
                    R.gt(R.__, playerTime * 1000),
                    R.lt(R.__, (playerTime + 1) * 1000)
                ),
                'progress'
            )
        )
    )(dmList.value);
    // 查找比 `curPlayerTime` 更晚的第一个的弹幕索引, 返回-1表示超出弹幕包范围
    const findLastingIndex = (playerTime, index) => R.pipe(
        R.slice(index, Infinity),
        R.findIndex(
            R.propSatisfies(
                R.gt(R.__, playerTime * 1000),
                'progress'
            )
        )
    )(dmList.value);

    const dmList = ref([]);
    let dmCount = 0;
    let segment_index = 1;
    const loadDmList = async (videoInfo) => {
        try {
            if(!videoInfo) return;
            // 弹幕包加载完毕
            if(dmCount >= videoInfo.stat.danmaku) {
                return;
            };
            const dmSegment = await fetchDmList(
                {
                    type: 1, 
                    oid: videoInfo.cid, 
                    segment_index, 
                    pid: videoInfo.aid, 
                    web_location: 1315873
                }, 
                sessdata);
            dmList.value = R.concat(dmList.value, dmSegment);
            segment_index++;
            dmCount += dmSegment.length;
            resetCurIndex(props.curPlayerTime);
        } catch(err) {
            console.log('弹幕包加载失败', err);
        };
    };

    const fetchDmList = async(params, sessdata = '') => {
        if('type' in params && 'oid' in params && 'segment_index' in params) {
            const wbi_key = store.state.userModule.wbi_key;
            const { img_key, sub_key } = wbi_key;
            const queryString = encWbi(params, img_key, sub_key);
            const newParams = new URLSearchParams(queryString);
            const response = await getDmList(newParams, sessdata);
            const responseBuffer = response.data;
            let byteArray;
            if (typeof Buffer !== 'undefined') {
                // Node.js 环境，将 ArrayBuffer 转为 Buffer
                byteArray = Buffer.from(responseBuffer);
            } else {
                // 浏览器环境，直接将 ArrayBuffer 转为 Uint8Array
                byteArray = new Uint8Array(responseBuffer);
            };
            const root = protobuf.Root.fromJSON(dmProto);
            const DmSegMobileReply = root.lookupType('bilibili.community.service.dm.v1.DmSegMobileReply');
            // 解码二进制数据
            const message = DmSegMobileReply.decode(byteArray); 
            // 将消息转为对象
            const object = DmSegMobileReply.toObject(message, {
                // 将 long 类型字段转为字符串
                longs: String,  
                // 将枚举类型字段转为字符串
                enums: String, 
                // 将 bytes 字段转为字符串
                bytes: String   
            });
            const elems = object.elems;
            return R.sort((a, b) => Math.floor(a.progress) - Math.floor(b.progress), elems);
        };
    };

    let videoInfo = ref(null);
    watch(() => props.playerVideoInfo, async (newInfo) => {
        videoInfo.value = newInfo;
        if(videoInfo.value) {
            await loadDmList(videoInfo.value);
        };
    });

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
        resetCurIndex,
        openDanmaku,
        closeDanmaku,
        pauseDanmaku
    });

    onUnmounted(() => {
        stopWatchPlayerTime();
        window.removeEventListener('resize', handleWindowResize);
    });
</script>

<style lang="scss" scoped>
    .danmuku-container {
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
    .player-danmuku-top {
        top: 0;
        left: 50%;
        transform: translate(-50%, var(--translateY, 0));
    }
    .player-danmuku-bottom {
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