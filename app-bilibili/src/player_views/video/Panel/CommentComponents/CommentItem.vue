<template>
    <div class="comments" v-if="props.commentList">
        <div class="comment" v-for="comment of props.commentList" :key="comment.rpid">
            <div class="header mb-10">
                <img class="avatar" :src="`${comment.member.avatar}@.avif`" alt="" referrerpolicy="no-referrer">
                <div class="flex-column">
                    <div class="flex-start">
                        <div class="text-[14px] mr-5" :class="comment.member.vip.vipType === 0 ? 'member-name-notvip' : 'member-name-vip'">{{ comment.member.uname }}</div>
                        <component 
                            :is="levelIcons[comment.member.level_info.current_level]" 
                            class="member-icon"
                            style="width: 30px; height: 30px;"
                        >
                        </component>
                        <component 
                            :is="upIcon" 
                            class="member-icon" 
                            v-if="props.upper && 'mid' in props.upper && comment.member.mid == props.upper.mid" 
                            style="display: inline-block ;width: 24px; height: 24px;"></component>
                    </div>
                    <div class="pubdate text-[12px]">{{ formatTime(comment.ctime) }}</div>
                </div>
            </div>
            <div class="comment-content text-[15px] mb-10" v-clamp="({isExtend: comment.isExtend, lineCount: 5})">
                <i v-if="'isTop' in comment && comment.isTop" id="top">置顶</i>
                <div class="mb-10 text-[14px] text" v-html="finalHTML(comment.content.message, comment.content.members.map(item => item.uname), comment.content.emote)"></div>
                <div class="pic"></div>
                <span class="toggle-btn" @click="comment.isExtend = !comment.isExtend">{{ comment.isExtend ? '收起' : '展开'}}</span>
                <div class="photos-area mt-5" v-if="comment.content.pictures">
                    <div class="photos-wrap" v-if="comment.content.pictures.length > 1">
                        <img 
                            v-for="(pic, index) of comment.content.pictures"
                            :key="pic.img_src"
                            v-lazyload="`${pic.img_src}@176w_176h_1c_1s.avif`"
                            v-overflow
                            alt="" 
                            class="photo mr-5" 
                            width="88"
                            height="88"
                            draggable="false"
                            @click="handleClickPhoto(comment.content.pictures, index)"
                            onerror="this.style.display='none'"
                        >
                    </div>
                    <div class="photos-wrap" v-else>
                        <img 
                            v-lazyload="`${getClipWidthAndHeight(comment.content.pictures[0])}`" 
                            alt="" 
                            class="photo" 
                            :height="comment.content.pictures[0].img_height > comment.content.pictures[0].img_width ? '180' : '135'"
                            :style="{'aspect-ratio': comment.content.pictures[0].img_width / comment.content.pictures[0].img_height}"
                            draggable="false"
                            @click="handleClickPhoto(comment.content.pictures, 0)"
                            onerror="this.style.display='none'"
                        >
                    </div>
                </div>
            </div>
            <div class="comment-info flex-start mb-10">
                <svg class="mr-5" id="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M9.283433333333333 2.0303066666666663C9.095466666666667 2.0083933333333333 8.921333333333333 2.09014 8.828166666666666
                    2.1991199999999997C8.424633333333333 2.6711333333333336 8.332133333333333 3.3649466666666665 8.029333333333334
                    3.9012466666666663C7.630633333333333 4.607453333333333 7.258833333333333 5.034486666666666 6.800866666666666 5.436006666666666C6.42382 
                    5.7665733333333336 6.042199999999999 5.987959999999999 5.666666666666666 6.09112L5.666666666666666 13.1497C6.19062 13.1611 
                    6.751966666666666 13.168333333333333 7.333333333333333 13.168333333333333C8.831233333333333 13.168333333333333 10.1019 13.120766666666665 
                    10.958166666666665 13.076699999999999C11.565133333333332 13.045433333333332 12.091966666666666 12.7451 12.366466666666668 
                    12.256733333333333C12.7516 11.571599999999998 13.2264 10.5669 13.514166666666664 9.3835C13.7823 8.2808 13.904599999999999 
                    7.374333333333333 13.959466666666666 6.734999999999999C13.984933333333332 6.438646666666667 13.750433333333334 6.166686666666667 
                    13.386666666666665 6.166686666666667L10.065133333333332 6.166686666666667C9.898433333333333 6.166686666666667 9.742666666666667 
                    6.08362 9.649833333333333 5.945166666666666C9.536066666666667 5.775493333333333 9.560033333333333 5.5828533333333334 9.6312 
                    5.403346666666666C9.783966666666666 5.013846666666666 9.983933333333333 4.432846666666666 10.062766666666667 3.90454C10.1406 
                    3.3830066666666667 10.121599999999999 2.9639466666666667 9.917133333333332 2.57626C9.697399999999998 2.1596933333333332 9.448266666666665 
                    2.0495266666666665 9.283433333333333 2.0303066666666663zM10.773433333333333 5.166686666666666L13.386666666666665 
                    5.166686666666666C14.269133333333333 5.166686666666666 15.036999999999999 5.875273333333333 14.9558 6.8206C14.897 7.505533333333333 
                    14.767199999999999 8.462733333333333 14.485833333333334 9.6198C14.170333333333334 10.917200000000001 13.6532 12.008466666666665 
                    13.238166666666666 12.746766666666666C12.7729 13.574433333333333 11.910266666666667 14.029 11.009566666666666 14.075366666666667C10.14 
                    14.120166666666666 8.851766666666666 14.168333333333333 7.333333333333333 14.168333333333333C5.862206666666666 14.168333333333333 
                    4.51776 14.1231 3.565173333333333 14.079633333333334C2.4932333333333334 14.030733333333332 1.5939999999999999 13.234466666666666 
                    1.4786599999999999 12.143466666666665C1.4028 11.426066666666665 1.3333333333333333 10.4978 1.3333333333333333 9.501666666666665C1.3333333333333333 8.588966666666666 1.3916466666666667 7.761233333333333 1.4598999999999998 7.104466666666667C1.5791666666666666 5.95696 2.5641 5.166686666666666 3.671693333333333 5.166686666666666L5.166666666666666 5.166686666666666C5.3793066666666665 5.166686666666666 5.709213333333333 5.063186666666667 6.141613333333333 4.68408C6.516733333333333 4.355193333333333 6.816366666666667 4.015666666666666 7.158533333333333 3.409613333333333C7.5023 2.8007333333333335 7.6041 2.0920066666666663 8.068066666666667 1.54932C8.372133333333332 1.1936466666666665 8.8718 0.9755333333333334 9.399233333333333 1.03704C9.949866666666665 1.10124 10.457733333333334 1.4577866666666666 10.801633333333331 2.109713333333333C11.148866666666665 2.767993333333333 11.143799999999999 3.4356599999999995 11.051833333333335 4.0520933333333335C10.993899999999998 4.44022 10.875366666666666 4.852359999999999 10.773433333333333 5.166686666666666zM4.666666666666666 13.122166666666667L4.666666666666666 6.166686666666667L3.671693333333333 6.166686666666667C3.029613333333333 6.166686666666667 2.5161533333333335 6.615046666666666 2.4545466666666664 7.207833333333333C2.3890599999999997 7.837933333333333 2.333333333333333 8.630433333333333 2.333333333333333 9.501666666666665C2.333333333333333 10.453433333333333 2.399833333333333 11.345266666666667 2.473113333333333 12.038333333333334C2.533993333333333 12.614133333333331 3.0083466666666667 13.053199999999999 3.6107466666666665 13.0807C3.9228066666666668 13.094899999999999 4.278173333333333 13.109333333333334 4.666666666666666 13.122166666666667z" fill="currentColor"></path>
                </svg>
                <span class="text-[13px] mr-10">{{ comment.like }}</span>
                <svg id="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M9.283433333333333 13.9697C9.095466666666667 13.9916 8.921333333333333 13.909866666666666 8.828166666666666 
                    13.8009C8.424633333333333 13.328866666666666 8.332133333333333 12.635066666666667 8.029333333333334 12.098766666666666C7.630633333333333 
                    11.392566666666667 7.258833333333333 10.9655 6.800866666666666 10.564C6.42382 10.233433333333332 6.042199999999999 10.012033333333333 
                    5.666666666666666 9.908866666666666L5.666666666666666 2.8503266666666662C6.19062 2.83892 6.751966666666666 2.8316799999999995 
                    7.333333333333333 2.8316799999999995C8.831233333333333 2.8316799999999995 10.1019 2.87922 10.958166666666665 
                    2.923313333333333C11.565133333333332 2.9545733333333333 12.091966666666666 3.254906666666667 12.366466666666668 
                    3.74326C12.7516 4.428373333333333 13.2264 5.4331 13.514166666666664 6.616486666666667C13.7823 7.719199999999999 
                    13.904599999999999 8.625666666666666 13.959466666666666 9.265C13.984933333333332 9.561366666666666 13.750433333333334 
                    9.833333333333332 13.386666666666665 9.833333333333332L10.065133333333332 9.833333333333332C9.898433333333333 
                    9.833333333333332 9.742666666666667 9.9164 9.649833333333333 10.054833333333333C9.536066666666667 10.224499999999999 
                    9.560033333333333 10.417133333333332 9.6312 10.596633333333333C9.783966666666666 10.986166666666666 9.983933333333333 
                    11.567166666666667 10.062766666666667 12.095466666666667C10.1406 12.616966666666666 10.121599999999999 13.036066666666665 
                    9.917133333333332 13.423766666666666C9.697399999999998 13.8403 9.448266666666665 13.950466666666665 9.283433333333333 
                    13.9697zM10.773433333333333 10.833333333333332L13.386666666666665 10.833333333333332C14.269133333333333 10.833333333333332 
                    15.036999999999999 10.124733333333332 14.9558 9.1794C14.897 8.494466666666666 14.767199999999999 7.537266666666666 14.485833333333334 
                    6.380213333333334C14.170333333333334 5.08278 13.6532 3.991546666666667 13.238166666666666 3.25324C12.7729 2.425586666666667 
                    11.910266666666667 1.9710199999999998 11.009566666666666 1.9246400000000001C10.14 1.8798599999999999 8.851766666666666 
                    1.8316866666666665 7.333333333333333 1.8316866666666665C5.862206666666666 1.8316866666666665 4.51776 1.8769066666666667 
                    3.565173333333333 1.9203599999999998C2.4932333333333334 1.969253333333333 1.5939999999999999 2.765553333333333 1.4786599999999999 
                    3.856533333333333C1.4028 4.573953333333333 1.3333333333333333 5.502233333333333 1.3333333333333333 6.498353333333332C1.3333333333333333 
                    7.411033333333333 1.3916466666666667 8.238766666666667 1.4598999999999998 8.895533333333333C1.5791666666666666 10.043033333333334 
                    2.5641 10.833333333333332 3.671693333333333 10.833333333333332L5.166666666666666 10.833333333333332C5.3793066666666665 10.833333333333332 
                    5.709213333333333 10.936833333333333 6.141613333333333 11.3159C6.516733333333333 11.644799999999998 6.816366666666667 11.984333333333334 
                    7.158533333333333 12.590399999999999C7.5023 13.199266666666666 7.6041 13.907999999999998 8.068066666666667 14.4507C8.372133333333332 
                    14.806333333333331 8.8718 15.024466666666665 9.399233333333333 14.962966666666667C9.949866666666665 14.898766666666667 10.457733333333334 
                    14.542233333333332 10.801633333333331 13.8903C11.148866666666665 13.232 11.143799999999999 12.564333333333332 11.051833333333335 
                    11.947933333333333C10.993899999999998 11.5598 10.875366666666666 11.147633333333333 10.773433333333333 
                    10.833333333333332zM4.666666666666666 2.8778466666666667L4.666666666666666 9.833333333333332L3.671693333333333 
                    9.833333333333332C3.029613333333333 9.833333333333332 2.5161533333333335 9.384966666666667 2.4545466666666664 
                    8.792166666666667C2.3890599999999997 8.162066666666666 2.333333333333333 7.369566666666666 2.333333333333333 
                    6.498353333333332C2.333333333333333 5.546566666666667 2.399833333333333 4.654719999999999 2.473113333333333 3.96168C2.533993333333333 
                    3.385866666666667 3.0083466666666667 2.946793333333333 3.6107466666666665 2.91932C3.9228066666666668 2.9050866666666666 
                    4.278173333333333 2.8906666666666667 4.666666666666666 2.8778466666666667z" fill="currentColor"></path>
                </svg>
            </div>
            <div class="comment-replies" v-if="props.isNeedShowReplies && comment.replies.length > 0">
                <div class="reply-item max-line text-[14px] line-15 mb-5" v-for="reply of comment.replies" :key="reply.rpid">
                    <span class="title">{{ reply.member.uname }}</span>
                    <component 
                        :is="upIcon" 
                        class="member-icon img" 
                        v-if="props.upper && 'mid' in props.upper && reply.member.mid == props.upper.mid" 
                        style="display: inline-block; width: 24px; height: 24px;"
                    ></component>
                    <span> : </span>
                    <span class="reply-content" v-html="finalHTML(reply.content.message, reply.content.members.map(item => item.uname), reply.content.emote)"></span>
                </div>
                <span class="extend-btn text-[12px]" @click="sendExtendReplies({oid: comment.oid, rpid: comment.rpid})">{{ comment.reply_control.sub_reply_entry_text }}</span>
            </div>
        </div>
        <div class="photo-wrap" v-if="photoSwipeState">
            <PhotoSwipe 
                :photoList="photoList"
                :photoIndex="photoIndex"
                @closePhoto="handleClosePhoto"
            >
            </PhotoSwipe>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import * as R from 'ramda';
    import DOMPurify from 'dompurify';
    import { formatTime } from '@/utils/videoFormatInfo';
    import upIcon from '@/assets/icon/other/up_pb.svg';
    import PhotoSwipe from '@/components/PhotoSwipe/index.vue';
    const props = defineProps({
        commentList: {
            type: Array,
            default: () => [] // 使用函数返回值防止其他实例引用
        },
        isNeedShowReplies: {
            type: Boolean,
            default: false
        },
        upper: {
            type: Object,
            default: null
        }
    });
    const emit = defineEmits(['updateDetailIds', 'updateDetailCommentState']);
    // 返回一个对象，其中 键是匹配的文件路径，如果eager 为true 值是导入的结果 为false值是导入该文件的函数
    const images = import.meta.glob('../../../assets/icon/other/*.svg', { eager: true });
    const levelIconsPath = [
        '../../../assets/icon/other/level_0.svg',
        '../../../assets/icon/other/level_1.svg',
        '../../../assets/icon/other/level_2.svg',
        '../../../assets/icon/other/level_3.svg',
        '../../../assets/icon/other/level_4.svg',
        '../../../assets/icon/other/level_5.svg',
        '../../../assets/icon/other/level_6.svg',
    ];
    const levelIcons = levelIconsPath.map(path => images[path]?.default);
    const initMentionLinks = (str, nameArray, emote = null) => {
        // 正则匹配 @ 后面的名称，名称是以字母、数字或下划线开头的连续字符
        const mentionRegex = /@([\p{L}\w]+)/gu;
        // 使用 replace 方法，替换匹配的 @xxx 为带 <a> 标签的 HTML
        const atStr = str.replace(mentionRegex, (match, mentionedName) => {
            // 如果当前名称在 nameArray 中，进行替换
            if (nameArray.includes(mentionedName)) {
                return `<a href="#" class="mention-link">${match}</a>`;
            };
            // 如果不匹配，则原样返回
            return match;
        });
        let atImgStr = atStr;
        if(emote) {
            Object.keys(emote).forEach(key => {
                atImgStr = R.replace(
                    new RegExp(key.replace(/[-/\\^$.*+?()[\]{}|]/g, '\\$&'), 'g'),
                    emote[key].meta.size === 1 ? 
                    `<img 
                            width="20" height="20" 
                            src=${emote[key].url} 
                            style="display: inline-block; vertical-align: text-bottom;" 
                            alt="" 
                            crossorigin="anonymous">`
                        : `<img 
                            width="50" height="50" 
                            src=${emote[key].url}
                            style="display: inline-block; vertical-align: text-bottom;" 
                            alt=""
                            crossorigin="anonymous">`,
                    atImgStr
                );
            });
        };
        return atImgStr;
    };
    // 清洗
    const sanitizeHTML = html => DOMPurify.sanitize(html, { ALLOWED_TAGS: ['a', 'img'] });
    const finalHTML = R.pipe(
        initMentionLinks,
        sanitizeHTML
    );
    const sendExtendReplies = ({oid, rpid}) => {
        emit('updateDetailCommentState', true);
        emit('updateDetailIds', {oid, rpid});
    };

    // 设置评论图片的宽高
    const getClipWidthAndHeight = imgInfo => {
        const { img_width, img_height, img_src } = imgInfo;
        const ratio = img_width / img_height;
        // 宽更大时高度为135 高更大时为180
        if(img_width > img_height) {
            const width = Math.floor(270 * ratio);
            return img_src + `@${width}w_270h_1s.avif`;
        }
        else {
            const width = Math.floor(360 * ratio);
            return img_src + `@${width}w_360h_1c_1s.avif`;
        };
    };

    const handleClickPhoto = (photos, index) => {
        openPhoto(photos, index);
    };

    let photoSwipeState = ref(false);
    const updatePhotoSwipeState = state => {
        photoSwipeState.value = state;
    };

    const handleClosePhoto = () => {
        updatePhotoSwipeState(false);
    };

    let photoList = ref([]);
    let photoIndex = ref(0);
    const openPhoto = (list, index) => {
        updatePhotoSwipeState(true);
        photoList.value = list;
        photoIndex.value = index;
    };

    // 局部自定义指令
    const vClamp = {
        mounted(el, binding) {
            const { isExtend, lineCount } = binding.value;
            el._oldValue = isExtend;
            const text = el.querySelector('.text');
            const btn = el.querySelector('.toggle-btn');
            const _pic = el.querySelector('.pic');
            const lineHeight = Math.ceil(getComputedStyle(text).getPropertyValue('line-height').split('px')[0]);
            const textHeight = Math.ceil(text.clientHeight);
            if(textHeight > lineHeight * lineCount) {
                btn.style.display = 'inline-block';
                if(!isExtend) {
                    text.style.cssText = `
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: ${lineCount};
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    `;
                }
                else {
                    text.style.cssText = `
                        text-overflow: '';
                        display: '';
                        -webkit-line-clamp: '';
                        -webkit-box-orient: '';
                        overflow: '';
                    `;
                };
            }
            else {
                btn.style.display = 'none';  
            };
        },
        updated(el, binding) {
            const { isExtend, lineCount } = binding.value;
            if(isExtend === el._oldIsExtend) return;
            el._oldIsExtend = isExtend;
            const text = el.querySelector('.text');
            if(!isExtend) {
                text.style.cssText = `
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: ${lineCount};
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                `;
            }
            else {
                text.style.cssText = `
                    text-overflow: '';
                    display: '';
                    -webkit-line-clamp: '';
                    -webkit-box-orient: '';
                    overflow: '';
                `;
            }
        }
    };

    // 判断元素是否溢出
    const vOverflow = {
        mounted(el) {
            const { parentNode } = el;
            if (!parentNode) {
                return;
            };
            // 检测是否超出父元素范围的方法
            const checkOverflow = () => {
                const parentRect = parentNode.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                // 检查是否超出父容器
                const isOverflowing = elRect.right > parentRect.right || elRect.left < parentRect.left;
                if(isOverflowing) {
                    el.style.display = 'none';
                };
            };
            // 初次检测
            checkOverflow();
        }
    };
</script>

<style lang="scss" scoped>
    $avatarWidth: 25px;
    $commentLineHeight: 20px;
    .comments {
        padding: 0 10px 0 ($avatarWidth + 10px);
        box-sizing: border-box;
        .comment {
            padding-top: 10px;
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
                .member-icon {
                    overflow-clip-margin: content-box;
                    overflow: clip;
                }
                .pubdate {
                    color: var(--text2-color);
                }
            }
            .comment-content {
                word-break: break-all;
                white-space: pre-wrap;
                overflow: hidden;
                #top {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    width: 30px;
                    height: 18px;
                    border: 1px solid var(--brand-pink);
                    border-radius: 3px;
                    color: var(--brand-pink);
                    vertical-align: text-bottom;
                    margin-bottom: 0.0666em;
                    font-size: 12px;
                    font-style: normal;
                }
                .text {
                    line-height: $commentLineHeight;
                }
                img {
                    vertical-align: bottom;
                }
                .toggle-btn {
                    color: var(--brand-blue);
                    cursor: pointer;
                    &:hover {
                        color: darken(#00AEEC, 20%);
                    }
                }
                .photos-area {
                    .photos-wrap {
                        display: flex;
                        flex-wrap: nowrap;
                        overflow: hidden;
                        width: 100%;
                        .photo {
                            display: block;
                            background: transparent;
                            border: none;
                            border-radius: 10px;
                            cursor: zoom-in;
                            user-select: none;
                            overflow: hidden;
                            flex: 0 1 auto;
                        }
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
                    line-height: 19px;
                    .title {
                        color: var(--Ga6);
                    }
                    .reply-content {
                        color: #fff;
                    }
                    .img {
                        vertical-align: middle;
                        width: 24px;
                        height: 24px;
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
            .line {
                margin-left: -($avatarWidth + 10px);
                height: 7px;
                background-color: #000;
                border-radius: 999px;
            }
            .sub-reply-title {
                color: var(--text2-color);
                margin-left: -$avatarWidth;
            }
        }
        .photo-wrap {
            position: absolute;
            top: calc(var(--nav-height) / 1.5);
            left: 0;
            width: 100%;
            height: calc(100% - var(--nav-height) / 1.5);
        }
    }
    .max-line {
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>