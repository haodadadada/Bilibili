<template>
    <!-- 单个评论详情 -->
    <section class="content" id="single-comment" v-if="!isLoadingDetailComment">
        <div class="detail-header flex-start">
            <component :is="leftIcon" class="img mr-10" @click="updateDetailCommentState(false)"></component>
            <span class="text-[15px]">详情</span>
        </div>

        <CommentItem :commentList="rootComment ? [rootComment] : null" :isNeedShowReplies="false"></CommentItem>

        <div class="line mr-10"></div>
        <div class="sub-reply-title text-[13px] mt-10">{{ rootComment ? rootComment.reply_control.sub_reply_title_text : ''}}</div>

        <CommentItem :commentList="replyList" :isNeedShowReplies="false"></CommentItem>
        <div id="sentinel"></div>
        <div v-if="isEndDetail" class="nomore-comment text-center text-[13px]">没有更多评论</div>
    </section>
</template>

<script setup lang="js">
    import { ref, onActivated, nextTick, onDeactivated, computed } from 'vue';
    import { useStore } from 'vuex';
    import * as R from 'ramda';
    import CommentItem from './CommentItem.vue';
    import { getSecondReply } from '@/api/comment/index';
    import observeLastEle from '@/utils/observer';
    import leftIcon from '@/assets/icon/common/left_dark.svg';
    defineOptions({
        name: 'CommentDetailSection'
    });
    const props = defineProps({
        detailIds: {
            type: Object
        }
    });
    const emit = defineEmits(['updateDetailCommentState']);
    const updateDetailCommentState = flag => {
        emit('updateDetailCommentState', flag);
        // 防止isEndDetail被缓存
        isEndDetail.value = false;
    };
    const store = useStore();
    const sessdata = store.state.userModule.sessdata || null;

    // 请求评论详情
    let isEndDetail = ref(false);
    let rootComment = ref(null);
    let replyList = ref([]);
    const fetchSecondReplyLazy = () => {
        let pn = 1;
        return async ({oid, rpid, type}) => {
            if(isEndDetail.value) return;
            const response = await getSecondReply({oid, root: rpid, type, pn}, sessdata);
            
            const successAction = R.pipe(
                R.path(['data']),
                R.tap(value => 
                {
                    replyList.value = replyList.value ? [...replyList.value, ...value.replies] : value.replies;
                    rootComment.value = value.root;
                    if(Number(pn * value.page.size) > Number(value.page.count)) {
                        isEndDetail.value = true;
                    };
                    pn++;
                })
            );
            const failAction = R.pipe(
                R.path(['message']),
                ElMessage.error
            );
            
            return R.ifElse(
                R.propEq(0, 'code'),
                successAction,
                failAction
            )(R.path(['data'], response));
        };
    };
    let fetchSecondReply = fetchSecondReplyLazy();
    // 是否正在获取详情
    let isLoadingDetailComment = ref(false);
    const updateLoadingDetailCommentState = flag => {
        isLoadingDetailComment.value = flag;
    };

    // 监视是否滚动到底部
    let observer;
    const observeBottom = async (fn, options) => {
        if(observer) observer.disconnect();
        await nextTick();
        const sentinel = document.querySelector('#sentinel');
        observer = observeLastEle(
            sentinel, 
            {
                rootMargin: '0px 0px 100px 0px',
            }, 
            fn, 
            options, sessdata
        );
    };
    const detailIds = computed(() => props.detailIds);

    const resetData = () => {
        // 防止一些数据被缓存
        isEndDetail.value = false;
        fetchSecondReply = fetchSecondReplyLazy();
        isLoadingDetailComment.value = false;
        replyList.value = [];
        rootComment.value = null;
    };

    onActivated(async () => {
        resetData();
        await nextTick();
        if(detailIds.value) {
            updateLoadingDetailCommentState(true);
            await fetchSecondReply({ oid: detailIds.value.oid, rpid: detailIds.value.rpid, type: 1 });
            updateLoadingDetailCommentState(false);
            await observeBottom(() => fetchSecondReply({ oid: detailIds.value.oid, rpid: detailIds.value.rpid, type: 1 }));
        };
    });

    onDeactivated(() => {
        if(observer) observer.disconnect();
    });
</script>

<style lang="scss" scoped>
    $avatarWidth: 25px;
    $commentLineHeight: 20px;
    $tabHeight: 40px;
    $sideLeft: 20px;
    ::-webkit-scrollbar {
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        background: var(--bg2-float);
    }
    ::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 5px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
    .content {
        padding: 0 0 10px $sideLeft;
        color: #fff;
        overflow-y: scroll;
        height: calc(100vh - (var(--nav-height) / 1.5) - $tabHeight);
        box-sizing: border-box;
        .category {
            .cat-btn {
                padding: 0 5px;
                color: var(--text2-color);
                transition: .2s;
                cursor: pointer;
                &:hover {
                    color: var(--brand-blue);
                }
            }
            .vertical-line {
                width: 1px;
                height: 10px;
                background-color: #666;
            }
            .active {
                color: #fff !important;
            }
        }
        .comments {
            .comment {
                padding: 0 10px 0 ($avatarWidth + 10px);
                box-sizing: border-box;
                .header {
                    position: relative;
                    min-height: $avatarWidth;
                    .avatar {
                        position: absolute;
                        left: -($avatarWidth + 10px);
                        top: 50%;
                        transform: translateY(-50%);
                        width: $avatarWidth;
                        height: $avatarWidth;
                        border-radius: 50%;
                    }
                    .member-name-vip {
                        color: var(--brand-pink);
                    }
                    .member-name-notvip {
                        color: var(--text2-color);
                    }
                    .level {
                        overflow-clip-margin: content-box;
                        overflow: clip;
                    }
                    .pubdate {
                        color: var(--text2-color);
                    }
                }
                .comment-content {
                    .text {
                        line-height: $commentLineHeight;
                    }
                    .toggle-btn {
                        color: var(--brand-blue);
                        cursor: pointer;
                        &:hover {
                            color: darken(#00AEEC, 20%);
                        }
                    }
                }
                .comment-info {
                    color: var(--text2-color);
                    svg {
                        width: 16px;
                        height: 16px;
                        transition: .2s;
                        &:hover {
                            color: var(--brand-pink);
                        }
                    }
                }
                .comment-replies {
                    background-color: var(--Ga9);
                    padding: 7px 5px;
                    border-radius: 5px;
                    .reply-item {
                        .title {
                            color: var(--Ga6);
                        }
                        .reply-content {
                            color: #fff;
                        }
                    }
                    .extend-btn {
                        color: var(--brand-blue);
                        cursor: pointer;
                        &:hover {
                            color: darken(#00AEEC, 20%);
                        }
                    }
                }
            }
        }
        .line {
            height: 7px;
            background-color: #000;
            border-radius: 999px;
        }
        .sub-reply-title {
            color: var(--text2-color);
        }
        .detail-header {
            border-bottom: 0.1px solid #333;
            margin-left: -$sideLeft;
            padding: 10px 0;
            .img {
                width: 20px;
                height: 20px;
                padding: 5px;
                transition: .2s;
                border-radius: 5px;
                margin-left: $sideLeft;
                &:hover {
                    background-color: var(--theme-hover-color);
                }
            }
        }
    }
</style>