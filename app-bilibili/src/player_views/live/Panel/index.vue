<template>
    <div class="container-panel" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @mousemove="handleMouseMove">
        <div class="danmaku-wrap" ref="danmakuWrapRef">
            <div class="danmaku-area pr-10">
                <div v-for="item of danmakuList" :key="item.id_str" class="danmaku-item text-[12px] mt-15">
                    <span class="medal inline-flex items-center text-[10px]" v-if="item.medal">
                        <img class="inline-block size-[15px]" :src="item.medal.honor_icon" v-if="item.medal.honor_icon">
                        <span 
                            class="medal-fan inline-flex items-center text-center pr-5 pl-5 mr-5" 
                            :style="{
                                '--color': item.medal.v2_medal_color_text,
                                '--color-border': item.medal.v2_medal_color_border,
                                '--color-start': item.medal.v2_medal_color_start,
                                '--color-end': item.medal.v2_medal_color_end,
                                '--color-level': item.medal.v2_medal_color_level
                            }"
                        >
                            <img class="inline-block size-[15px]" :src="item.medal.guard_icon" v-if="item.medal.guard_icon">
                            <span class="mr-5">{{ item.medal.name }}</span>
                            <span class="medal-fan-level text-[10px]">{{ item.medal.level }}</span>
                        </span>
                    </span>
                    <span class="user-name font-semibold">{{ item.userName }} :</span>
                    <span class="danmaku-content font-semibold" v-html="finalHTML(item.content, item.emots)"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ComputedRef, ref, nextTick, watch, onBeforeUnmount } from 'vue';
    import DOMPurify from 'dompurify';
    import * as R from 'ramda';
    interface DanmakuItem {
        content: string;
        emots: object | null;
        id_str: string;
        userName: string;
        medal: DanmakuUserMedal;
    }
    interface DanmakuUserMedal {
        color: number;
        color_border: number;
        color_end: number;
        color_start: number;
        v2_medal_color_border: string;
        v2_medal_color_end: string;
        v2_medal_color_level: string;
        v2_medal_color_start: string;
        v2_medal_color_text: string;
        name: string;
        level: number;
        guard_level: number;
        guard_icon?: string;
        honor_icon: string;
        id: number;
    }

    const props = defineProps(['danmakuList', 'roomid']);
    let danmakuWrapRef = ref<HTMLElement | null>(null);
    let danmakuList: ComputedRef<DanmakuItem[]> = computed(() => props.danmakuList);
    let isNeedAutoScroll = ref<boolean>(true);

    let isShowScroll = ref<boolean>(false);
    const updateScrollState = (state: boolean) => {
        isShowScroll.value = state;
    };
    const handleMouseEnter = () => {
        updateScrollState(true);
    };
    const handleMouseLeave = () => {
        updateScrollState(false);
    };
    const handleMouseMove = () => {
        updateScrollState(true);
    };
    
    const initMentionLinks = (str: string, emote: any = null) => {
        let imgStr = str;
        if(emote) {
            Object.keys(emote).forEach(key => {
                imgStr = R.replace(
                    new RegExp(key.replace(/[-/\\^$.*+?()[\]{}|]/g, '\\$&'), 'g'),
                    `<img 
                        width="${emote[key].width}" height="${emote[key].height}" 
                        src=${emote[key].url} 
                        style="display: inline-block; vertical-align: text-bottom;" 
                        alt="" 
                        crossorigin="anonymous"
                    >`,
                    imgStr
                );
            });
        };
        return imgStr;
    };
    // 清洗
    const sanitizeHTML = (html: string) => DOMPurify.sanitize(html, { ALLOWED_TAGS: ['a', 'img'] });
    const finalHTML = R.pipe(
        initMentionLinks,
        sanitizeHTML
    );

    // watch的回调函数默认在DOM更新前执行
    const stopWatchDanmakuList = watch(() => danmakuList.value, async () => {
        if(danmakuWrapRef.value) {
            if(danmakuWrapRef.value.scrollTop + danmakuWrapRef.value.clientHeight === danmakuWrapRef.value?.scrollHeight) {
                isNeedAutoScroll.value = true;
            } else {
                isNeedAutoScroll.value = false;
            };
        };                                
        await nextTick();
        if(danmakuWrapRef.value && isNeedAutoScroll.value) danmakuWrapRef.value.scrollTop = danmakuWrapRef.value.scrollHeight;
    }, { deep: true });
    onBeforeUnmount(() => {
        stopWatchDanmakuList();
    });
</script>

<style lang="scss" scoped>
    .danmaku-wrap::-webkit-scrollbar {
        width: 12px;
    }
    .danmaku-wrap::-webkit-scrollbar-track {
        background: transparent;
    }
    .danmaku-wrap::-webkit-scrollbar-thumb {
        background-color: rgba(136, 136, 136, 0); /* 初始完全透明 */
        border-radius: 7px;
        border: 2px solid transparent;
        background-clip: content-box;
    }
    .danmaku-wrap:hover::-webkit-scrollbar-track {
        background: rgba(45, 45, 45, 1);
    }
    .danmaku-wrap:hover::-webkit-scrollbar-thumb {
        background-color: rgba(136, 136, 136, 0.7);
    }
    .danmaku-wrap::-webkit-scrollbar-thumb:hover {
        background-color: rgba(136, 136, 136, 1);
    }
    .container-panel {
        display: flex;
        flex-direction: column;
        height: 100%;
        border: #2f3134 1px solid;
        box-sizing: border-box;
        padding: 20px 0px 20px 10px;
        background-color: #101011;
        .danmaku-wrap {
            flex: 1;
            overflow-y: auto;
            .danmaku-area {
                user-select: none;
                .danmaku-item {
                    min-height: 18px;
                    .medal {
                        height: 100%;
                        vertical-align: bottom;
                        .medal-fan {
                            border-color: var(--color-border);
                            background: linear-gradient(90deg, var(--color-start), var(--color-end));
                            color: var(--color);
                            height: 18px;
                            border-radius: 999px;
                            .medal-fan-level {
                                background-color: #fff;
                                color: var(--color-level);
                                border-radius: 50%;
                                width: 15px;
                                height: 15px;
                            }
                        }
                    }
                    .user-name {
                        color: var(--text2);
                        white-space: normal;
                        word-break: break-all;
                    }
                    .danmaku-content {
                        color: var(--text3);
                        white-space: normal;
                        word-break: break-all;
                    }
                }
            }
      
        }
    }
</style>