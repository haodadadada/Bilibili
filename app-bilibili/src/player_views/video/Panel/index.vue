<template>
    <div class="container-panel">
        <header class="tab-area">
            <div class="tab-wrap flex-center flex-between">
                <div class="tab-left text-[15px] flex-center pb-5">
                    <span class="text-center tab-btn" :class="{'active': tabBtnIndex === 0}" @click="handleClickTabBtn(0)">简介</span>
                    <span class="flex-center tab-comment">
                        <span class="text-center tab-btn flex-center" :class="{'active': tabBtnIndex === 1}" @click="handleClickTabBtn(1)">评论</span>
                        <span class="text-[12px] count">{{ formatView(props.reply) }}</span>
                    </span>
                    <span class="underline" ref="underlineRef"></span>
                </div>
                <component :is="dropdownImg" @click="handleClickDropImg" class="img"></component>
                <transition name="opacity-fade">
                    <div class="tab-panel" v-if="tabPanelState">
                        <div class="reload-btn text-[13px] weight-6">
                            <div class="reload-btn-item flex-center" @click="handleClickReloadBtn">
                                <svg
                                    t="1731235427794"
                                    class="mr-5"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="7440"
                                    width="17"
                                    height="17">
                                    <path
                                        d="M512 874.666667c-196.266667 0-358.4-162.133333-358.4-362.666667H89.6c0 234.666667 192 426.666667 422.4 426.666667 153.6 0 285.866667-81.066667 362.666667-204.8v145.066666H938.666667v-221.866666c0-17.066667-8.533333-25.6-21.333334-25.6h-221.866666v64h128c-68.266667 106.666667-179.2 179.2-311.466667 179.2zM934.4 512c0-234.666667-192-426.666667-422.4-426.666667-153.6 0-285.866667 81.066667-362.666667 204.8V149.333333H85.333333v221.866667c0 12.8 8.533333 21.333333 21.333334 21.333333h221.866666V328.533333h-128c64-106.666667 179.2-174.933333 307.2-174.933333 196.266667 0 358.4 162.133333 358.4 362.666667h68.266667z"
                                        p-id="7441"
                                        fill="currentColor">
                                    </path>
                                </svg>
                                <span>重新加载</span>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </header>
        <keep-alive>
            <component 
                :is="selectComponent.component"
                :key="selectComponent.key"
                :detailIds="detailIds"
                @updateDetailCommentState="updateDetailCommentState" 
                @updateDetailIds="updateDetailIds"
            >
            </component>
        </keep-alive>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, nextTick, computed } from 'vue';
    import { formatView } from '@/utils/videoFormatInfo';
    import CommentsSection from './CommentComponents/CommentsSection.vue';
    import CommentDetailSection from './CommentComponents/CommentDetailSection.vue';
    import InfoComponents from './InfoComponents/index.vue';
    import dropdownImg from '@/assets/icon/common/dropdown.svg';
    const props = defineProps(['reply']);
    const selectComponent = computed(() => {
        if(tabBtnIndex.value === 0) {
            return { 
                component: InfoComponents,
                key: 1
            };
        }
        else if(tabBtnIndex.value === 1) {
            if(isShowDetailComment.value) {
                return {
                    component: CommentDetailSection,
                    key: 2
                };
            } else {
                return {
                    component: CommentsSection,
                    key: 3
                };
            };
        }
        else {
            return InfoComponents;
        };
    });
    // 简介/评论
    let tabBtnIndex = ref(0);
    const handleClickTabBtn = (index: number) => {
        updateTabBtnIndex(index);
    };
    const updateTabBtnIndex = (index: number) => {
        if(index === tabBtnIndex.value) return;
        if(index !== 0 && index !== 1) return;
        tabBtnIndex.value = index;
        locateLine();
    };

    const lineWidth = 20;
    const tabBtnWidth = 50;
    const underlineRef = ref();
    const locateLine = () => {
        underlineRef.value.style.left = (tabBtnWidth - lineWidth) / 2 + tabBtnWidth * tabBtnIndex.value + 'px';
    };

    let isShowDetailComment = ref(false);
    const updateDetailCommentState = (flag: boolean) => {
        isShowDetailComment.value = flag;
    };

    let detailIds = ref({});
    const updateDetailIds = (ids: { oid: number, rpid: number }) => {
        detailIds.value = ids;
    };

    const handleClickDropImg = () => {
        updateTabPanelState(!tabPanelState.value);
    };

    let tabPanelState = ref(false);
    const updateTabPanelState = (state: boolean) => {
        tabPanelState.value = state;
    };

    const handleClickReloadBtn = () => {
        reloadPlayerWindow();
    };
    const reloadPlayerWindow = () => {
        window.electronAPI.sendMessage('player_reload', JSON.stringify({ windowId: 'video' }));
    };

    onMounted(async () => {
        await nextTick();
        locateLine();
    });
</script>
<style lang="scss" scoped>
$lineWidth: 20px;
$tabHeight: 40px;
.container-panel {
    user-select: text;
    width: 380px;
    height: 100%;
    background-color: var(--Ga10);
    .tab-area {
        padding: 0px 20px;
        height: $tabHeight;
        box-sizing: border-box;
        border-bottom: 0.1px solid #333;
        user-select: none;
        .tab-wrap {
            position: relative;
            .tab-left {
                position: relative;
                height: 40px;
                box-sizing: border-box;
                .tab-btn {
                    width: 50px;
                    color: #fff;
                    transition: .2s;
                    cursor: pointer;
                    &:hover {
                        color: var(--brand-pink);
                    }
                }
                .tab-comment {
                    cursor: pointer;
                }
                .tab-comment:hover .tab-btn,  .tab-comment:hover .count {
                    color: var(--brand-pink);
                }
                .count {
                    transition: .2s;
                    color: var(--text2-color);
                }
                .active {
                    color: var(--brand-pink);
                }
                .underline {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: $lineWidth;
                    height: 3px;
                    background-color: var(--brand-pink);
                    border-radius: 999px;
                    transition: .2s;
                }
            }
            .img {
                width: 20px;
                height: 20px;
                margin: 0 5px;
                padding: 5px;
                transition: .2s;
                border-radius: 5px;
                &:hover {
                    background-color: var(--theme-hover-color);
                }
            }
            .tab-panel {
                position: absolute;
                right: 0;
                bottom: 0;
                transform: translateY(100%);
                width: 140px;
                border-radius: 5px;
                padding: 10px 0;
                background-color: var(--Ga9);
                .reload-btn {
                    color: #fff;
                    .reload-btn-item {
                        cursor: pointer;
                    }
                }
            }
            .opacity-fade-enter-active, .opacity-fade-leave-active {
                transition: opacity 0.2s;
            }
            .opacity-fade-enter-from, .opacity-fade-leave-to {
                opacity: 0;
            }
        }
    }
}

</style>
<style lang="scss">
    .mention-link {
        text-decoration: none;
        color: var(--brand-blue);
        &:hover {
            color: darken(#00AEEC, 20%);
        }
    }
</style>