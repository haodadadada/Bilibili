<template>
    <div class="container">
        <div class="bg"></div>
        <section>
            <div class="content">
                <div class="item flex-center">
                    <img
                        :src="props.photoList[curPhotoIndex].img_src"
                        class="photo"
                        @load="handleImgLoadSuccess"
                        @error="handleImgLoadError"
                        v-show="!isLoading"
                    >
                </div>
                <div class="spinner" v-if="isLoading">
                    <img :src="loadingIcon" alt="" width="24" height="24">
                    <span>正在玩命加载…</span>
                </div>
            </div>
            <div class="next button" @click="handleClickNextBtn">
                <component :is="leftIcon" class="img"></component>
            </div>
            <div class="prev button" @click="handleClickPrevBtn">
                <component :is="leftIcon" class="img"></component>

            </div>
            <div class="close button" @click="closePhoto">
                <component :is="closeIcon" class="img"></component>
            </div>
            <div class="thumb" v-if="props.photoList && props.photoList.length > 1">
                <div 
                    class="thumb-item"
                    :class="{'active': curPhotoIndex === index}"
                    v-for="(pic, index) of props.photoList" :key="pic.img_src"
                    @click="handleClickThumb(index)"
                >
                    <img :src="`${pic.img_src}@96w_96h_1c.webp`" alt="">
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch, onUnmounted } from 'vue';
    import leftIcon from '@/assets/icon/common/left_dark.svg';
    import closeIcon from '@/assets/icon/common/close_dark.svg';
    import loadingIcon from '@/assets/icon/other/loading-blue.gif';
    interface PhtotListItem {
        img_src: string;
    }
    const props = defineProps<{
        photoList: PhtotListItem[],
        photoIndex: number
    }>();
    const emit = defineEmits(['closePhoto']);
    const closePhoto = () => {
        emit('closePhoto');
    };
    let curPhotoIndex = ref<number>(props.photoIndex);

    const updateCurPhotoIndex = (index: number) => {
        curPhotoIndex.value = index;
    };

    const handleClickThumb = (index: number) => {
        if(index === curPhotoIndex.value) return;
        updateCurPhotoIndex(index);
    };

    const handleClickNextBtn = () => {
        if(curPhotoIndex.value === props.photoList.length - 1) {
            updateCurPhotoIndex(0);
        } else {
            updateCurPhotoIndex(curPhotoIndex.value + 1);
        };
    };
    const handleClickPrevBtn = () => {
        if(curPhotoIndex.value === 0) {
            updateCurPhotoIndex(props.photoList.length - 1);
        } else {
            updateCurPhotoIndex(curPhotoIndex.value - 1);
        };
    };

    let isLoading = ref(true);
    const updateLoadingState = (state: boolean) => {
        isLoading.value = state;
    };
    const stopWatchIndex = watch(curPhotoIndex, () => {
        updateLoadingState(true);
    });
    const handleImgLoadSuccess = () => {
        updateLoadingState(false);
    };
    const handleImgLoadError = () => {
        updateLoadingState(false);
    };
    onUnmounted(() => {
        stopWatchIndex();
    });
</script>

<style lang="scss" scoped>
    .container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
        .bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: var(--bg3-float);
            opacity: .8;
        }
        section {
            .item {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                .photo {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: scale-down;
                }
            }

            .spinner {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                padding: 20px 0;
                width: 100%;
                text-align: center;
                font-size: 14px;
                color: var(--text3);
                pointer-events: none;
                z-index: 2;
                img {
                    margin-right: 8px;
                    vertical-align: bottom;
                }
            }

            .button {
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                z-index: 2;
                width: 42px;
                height: 42px;
                border-radius: 50%;
                color: var(--text_white);
                cursor: pointer;
                outline: none;
                border: none;
                transition: .2s;
                .img {
                    width: 20px;
                    height: 20px;
                }
            }
            .next {
                right: 16px;
                top: 50%;
                transform: translateY(-50%) rotate(180deg);
                &:hover {
                    background-color: rgba(60, 60, 60, 0.5);
                }
            }
            .prev {
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                &:hover {
                    background-color: rgba(60, 60, 60, 0.5);
                }
            }
            .close {
                right: 16px;
                top: 16px;
                background-color: rgba(0, 0, 0, 0.8);
                &:hover {
                    background-color: rgba(97, 96, 96, 0.5);
                }
            }
            .thumb {
                display: flex;
                align-items: center;
                position: absolute;
                left: 50%;
                bottom: 30px;
                z-index: 2;
                padding: 6px 10px;
                border-radius: 8px;
                background: rgba(24, 25, 28, .8);
                backdrop-filter: blur(20px);
                transform: translate(-50%);
                .thumb-item {
                    width: 54px;
                    height: 54px;
                    padding: 1px;
                    border: 2px solid transparent;
                    border-radius: 8px;
                    transition: .3s;
                    cursor: pointer;
                    box-sizing: border-box;
                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 6px;
                        -webkit-user-drag: none;
                        pointer-events: none;
                    }
                }
                .active {
                    border-color: var(--brand-pink);
                }
            }
        }
    }
</style>