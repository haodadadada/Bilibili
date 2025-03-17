<template>
    <div class="container">
        <!-- 总评论 -->
        <section class="content" ref="allCommentsRef" @scroll="handleScroll">
            <div v-if="!isLoadingComments">
                    <div class="category flex-start">
                    <span class="text-[12px] cat-btn" :class="{'active': catBtnIndex === 0}" @click="handleClickCatBtn(0)">最热</span>
                    <span class="vertical-line"></span>
                    <span class="text-[12px] cat-btn" :class="{'active': catBtnIndex === 1}" @click="handleClickCatBtn(1)">最新</span>
                </div>

                <CommentItem 
                    :commentList="commentList" 
                    :isNeedShowReplies="true" 
                    :upper="replyItem.upper" 
                    @updateDetailCommentState="updateDetailCommentState" 
                    @updateDetailIds="updateDetailIds"
                    class="mb-20">
                </CommentItem>
                <div v-if="isEnd" class="nomore-comment text-center text-[13px]">没有更多评论</div>
                <div v-if="!isLogin && !isEnd" class="nomore-comment text-center text-[13px]">登录查看更多评论</div>
            </div>
            <div v-if="isLoadingComments" class="text-[12px] text-center" style="color: var(--text2-color);">正在加载...</div>
            <div id="sentinel" style="height: 1px;"></div>
        </section>
    </div>
</template>

<script setup>
    import { ref, reactive, onActivated, nextTick, onDeactivated, computed, inject, watch } from 'vue';
    import { useStore } from 'vuex';
    import * as R from 'ramda';
    import CommentItem from './CommentItem.vue';
    import { getMainReply, getPermissionsReply } from '@/api/comment/index';
    import encWbi from '@/utils/wrid';
    import observeLastEle from '@/utils/observer';
    import debounce from '@/utils/common/debounce';
        defineOptions({
        name: 'CommentIndex'
    });
    const emit = defineEmits(['updateDetailCommentState', 'updateDetailIds']);
    const updateDetailCommentState = flag => emit('updateDetailCommentState', flag);
    const updateDetailIds = ids => emit('updateDetailIds', ids);
    const store = useStore();
    const sessdata = store.state.userModule.sessdata || null;
    
    // 是否正在请求主评论
    let isLoadingComments = ref(false);
    const updateLoadingCommentsState = state => {
        isLoadingComments.value = state;
    };

    // 最新/最热
    let catBtnIndex = ref(0);
    const updateCatBtnIndex = async index => {
        catBtnIndex.value = index;
    };
    const handleClickCatBtn = async index => {
        try {
            if(index === catBtnIndex.value) return;
            updateLoadingCommentsState(true);
            updateCatBtnIndex(index);
            replyItem.value = {};
            pagination.value = {
                offset: ''
            };
            await fetchMainReply({type: 1, oid: videoItem.value.aid}, sessdata);
        } finally {
            updateLoadingCommentsState(false);
        };
    };
    /** 
     * isEnd 是否为最后一页
     * replyItem 当前评论信息
    */
    let replyItem = ref({});
    let isEnd = ref(false);
    let pagination = ref({
        offset: ''
    });
    let pagination_str = computed(() => JSON.stringify(pagination.value));
    const fetchMainReplyLazy = () => {
        const web_location = 1315875;
        const plat = '1';
        // 防止多次重复请求
        let isLoading = false;
        return async ({ type, oid }, sessdata = '') => {
            try {
                if(!isEnd.value && !isLoading) {
                    isLoading = true;
                    const mode = catBtnIndex.value === 0 ? 3 : 2;
                    const paginationType = catBtnIndex.value === 0 ? 1 : 3;
                    const wbi_key = store.state.userModule.wbi_key;
                    const { img_key, sub_key } = wbi_key;
                    const params = { type, oid, mode, plat, web_location, pagination_str: pagination_str.value };
                    const queryString = encWbi(params, img_key, sub_key);
                    const newParams = new URLSearchParams(queryString);
                    // 将 URLSearchParams 转换为对象
                    const paramsObj = Object.fromEntries(newParams.entries());
                    const response = await getMainReply(paramsObj, sessdata);
                    const successAction = R.pipe(
                        R.path(['data']),
                        R.tap(value => {
                            isEnd.value = value.cursor.is_end;
                            const replies = replyItem.value.replies ? [...replyItem.value.replies, ...value.replies] : value.replies;
                            replyItem.value = {...value, replies};
                            if(paginationType == 1) {
                                pagination.value = {
                                    offset: value.cursor.pagination_reply.next_offset,
                                    type: paginationType,
                                    data: value.cursor.next
                                };
                            }
                            else if(paginationType == 3) {
                                pagination.value = {
                                    offset: value.cursor.pagination_reply.next_offset,
                                    type: paginationType,
                                    Data: value.cursor.next
                                };
                            };
                            R.ifElse(
                                R.propEq(true, 'value'),
                                () => {},
                                () => replyItem.value.replies = R.slice(0, 3)(replyItem.value.replies)
                            )(isLogin);
                            replyItem.value.replies = R.map(item => ({...item, isExtend: false}), replyItem.value.replies);
                        })
                    );
                    const failAction = R.pipe(
                        R.path(['message']),
                        ElMessage.error
                    );
                    
                    R.ifElse(
                        R.propEq(0, 'code'),
                        successAction,
                        failAction
                    )(R.path(['data'], response));
                    isLoading = false;
                };
            } catch(error) {
                isLoading = false;
                console.log(error);
            };
        };
    };
    const fetchMainReply = fetchMainReplyLazy();
    const commentList = computed(() => [
        ...(reactive(R.map(item => ({...item, isTop: true}), replyItem.value.top_replies || []))),
        ...(replyItem.value.replies || [])
    ]);
    

    // 是否登录
    let isLogin = ref(true);
    const fetchPermissionReply = async ({type, oid}, sessdata) => {
        const response = await getPermissionsReply({type, oid}, sessdata);
        isLogin.value = R.path(['data', 'code'], response) == 0;
    };

    // 监视是否滚动到底部
    const observeBottom = async (fn, options) => {
        if(observer) observer.disconnect();
        await nextTick();
        const sentinel = document.querySelector('#sentinel');
        observer = observeLastEle(
            sentinel, 
            {
                rootMargin: '0px 0px 100px 0px',
            }, 
            () => fn(options, sessdata), 
        );
    };

    let scrollPositionY = 0;
    const allCommentsRef = ref();
    const handleScroll = debounce((e) => {
        if(e.target) scrollPositionY = e.target.scrollTop;
    });

    // 详情页返回后重新监视
    const reObserve = async (isLogin, aid) => {
        if(isLogin && aid) {
            await observeBottom(() => fetchMainReply({ type: 1, oid: videoItem.value.aid }), );
        };
    };

    // 接收主窗口传递的信息
    let videoItem = ref({});
    let observer;
    const videoInfo = inject('videoInfo');
    const handleLoadInfo = async() => {
        updateLoadingCommentsState(true);
        try {
            videoItem.value = videoInfo.value;
            await fetchPermissionReply({type: 1, oid: videoItem.value.aid, web_location: 333.788}, sessdata);
            await fetchMainReply({type: 1, oid: videoItem.value.aid}, sessdata);
            if(isLogin.value) {
                await observeBottom(fetchMainReply, {type: 1, oid: videoItem.value.aid});
            };
        } finally {
            updateLoadingCommentsState(false);
        };
  
    };
    // 判断依赖的变量是否已经有值
    if(videoInfo.value && Object.keys(videoInfo.value).length) {
        // 已有值
        handleLoadInfo();
    }
    else {
        // 没有则监听
        watch(videoInfo, async () => {
            handleLoadInfo();
        }, { once: true });
    };
    
    onActivated(async () => {
        await nextTick();
        // 详情页返回后需要重新监视
        reObserve(isLogin.value, videoItem.value.aid);
        if(allCommentsRef.value) allCommentsRef.value.scrollTop = scrollPositionY;
    });

    onDeactivated(() => {
        if(observer) observer.disconnect();
        if(allCommentsRef.value) allCommentsRef.value.removeEventListener('scroll', handleScroll);
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
    .container {
        height: 100%;
    }
    .content {
        padding: 10px 0 10px $sideLeft;
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
            img {
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