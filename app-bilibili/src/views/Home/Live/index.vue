<template>
  <div class='container-rcmd'>
    <header class="category-area" v-if="!isLoadingArea">
      <div class="category-parent-wrap">
        <div 
          class="category-item text-[15px] weight-5" 
          :class="{ 'active': 0 == curParentId }"
          @click="handleClickParentArea({ id: 0, name: '推荐', list: [] })"
        >
          推荐
        </div>
        <div 
          class="category-item text-[15px] weight-5" 
          :class="{ 'active': Number(area.id) == curParentId }"
          v-for="area of parentAreas" 
          :key="area.id" 
          @click="handleClickParentArea(area)"
        >
          {{ area.name }}
        </div>
      </div>
      <div class="category-child flex-between">
        <div class="category-child-wrap" :class="{ 'close': !isExtend }" v-if="currentParentArea && currentParentArea.list.length" ref="categoryChildWrapRef">
          <div 
            class="category-item text-[13px]" 
            :class="{ 'active': 0 == curAreaId }"
            @click="handleClickChildArea({ id: '0', name: '全部' })"
          >
            全部
          </div>
          <div 
            class="category-item text-[13px]" 
            :class="{ 'active': Number(area.id) == curAreaId }"
            v-for="area of currentParentArea.list" 
            :key="area.id"
            @click="handleClickChildArea(area)"
          >
            {{ area.name }}
          </div>
        </div>
        <div>
          <div class="extend-btn text-[15px] flex items-center" v-if="currentParentArea && currentParentArea.list.length > 5">
            <span @click="handleClickExtendBtn" class="mr-5">展开更多</span>
            <component :is="downIcon" class="img" :style="isExtend ? 'transform: rotate(180deg)' : ''"></component>
          </div>
        </div>
      </div>
    </header>
    <section class='content-rcmd'>
      <div class='content-wrap' v-if='rcmdLiveRooms.length > 0' style='--cover-radio: 56.25%'>
        <div
          v-for='(item, index) in rcmdLiveRooms'
          :key='item.roomid'
          class='box-card'
          v-skeleton
          @click="handleClickLiveRoom(item, index)"
        >
          <div
            class='box-card-wrap flex-column-center'
          >
            <div class='card-content'>
              <div class='card-cover'>
                <div class='img-wrap'>
                  <img
                    alt=''
                    class='img'
                    v-lazyload='`${item.cover}@1e_1c.avif`'
                    crossorigin='anonymous'
                    onerror="this.style.display='none'"
                  />
                </div>
                <div class='card-mask'>
                  <div class='card-mask-info flex-between'>
                    <div class='card-mask-info-left flex-start'>
                      <span class='flex-center'>
                          <component :is='onlineIcon' class='card-mask-icon mr-3'></component>
                        <span>{{ item.watched_show.text_small }}</span>
                      </span>
                    </div>
                    <div>{{ item.area_name }}</div>
                  </div>
                </div>
              </div>
              <div
                class='card-inline-player'
                :class="curMouseIndex === index ? '' : 'invisible'"
                @mouseenter="handleMouseEnter(item, index)"
                @mouseleave="handleMouseLeave(index)"
              >
                <div class='card-player-area'>
                  <div class='card-video-wrap'>
                    <video
                      ref='videoRefs'
                      preload='auto'
                      crossorigin='anonymous'
                    ></video>
                  </div>
                </div>
              </div>
            </div>
            <div class='card-info'>
              <div class='card-title flex-between'>
                <span>{{ item.title }}</span>
              </div>
              <div class='card-info-bottom flex-start'>
                <div class='card-info-owner flex-start'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    xmlns:xlink='http://www.w3.org/1999/xlink'
                    viewBox='0 0 24 24'
                    width='24'
                    height='24'
                    fill='currentColor'
                    class='card-svg mr-5'
                  >
                    <path
                      d='M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z'
                      fill='currentColor'
                    ></path>
                    <path
                      d='M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z'
                      fill='currentColor'
                    ></path>
                    <path
                      d='M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z'
                      fill='currentColor'
                    ></path>
                  </svg>
                  <span class='card-info-bottom-author'
                    >{{ item.uname }} ·
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='skeleton-wrap' style='--cover-radio: 56.25%' v-if='isLoading'>
        <div class='box-card-skeleton' v-for="index in pageSize" :key="index">
          <div class='card-skeleton-cover'></div>
          <div class='card-skeleton-info'>
            <p class='card-skeleton-text'></p>
            <p class='card-skeleton-text short'></p>
            <p class='card-skeleton-text-light'></p>
          </div>
        </div>
      </div>
      <div class='refresh-btn-rcmd flex-center' @click="handleClickRefreshBtn">
        <svg
          xmlns='http://www.w3.org/2000/svg'
          xmlns:xlink='http://www.w3.org/1999/xlink'
          viewBox='0 0 24 24'
          width='24'
          height='24'
          class='btn-icon'
          fill='currentColor'
        >
          <path
            d='M12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5C14.0667 19.5 15.9365 18.6654 
                    17.2941 17.3125C17.6853 16.9226 18.3185 16.9237 18.7083 17.3149C19.0982 17.7061 19.0971 18.3393 18.7059 18.7291C16.9887 20.4404 14.6172 21.5 12 
                    21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12C21.5 12.356 21.4804 12.7078 21.4421 
                    13.0543C21.3814 13.6033 20.8872 13.9991 20.3382 13.9384C19.7893 13.8777 19.3935 13.3835 19.4542 12.8346C19.4844 12.5609 19.5 12.2825 19.5 
                    12C19.5 7.85786 16.1421 4.5 12 4.5z'
            fill='currentColor'
          ></path>
          <path
            d='M17.2929 10.7929C17.6834 10.4024 18.3166 10.4024 18.7071 10.7929L20.5 
                        12.5858L22.2929 10.7929C22.6834 10.4024 23.3166 10.4024 23.7071 10.7929C24.0976 11.1834 24.0976 11.8166 23.7071 12.2071L21.3839 14.5303C20.8957 
                        15.0185 20.1043 15.0185 19.6161 14.5303L17.2929 12.2071C16.9024 11.8166 16.9024 11.1834 17.2929 10.7929z'
            fill='currentColor'
          ></path>
        </svg>
      </div>
    </section>
    <div id='sentinel'></div>
  </div>
</template>

<script setup lang='ts'>
import { ref, Ref, onActivated, onDeactivated, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import * as R from 'ramda';
import debounce from '@/utils/common/debounce';
import encWbi from '@/utils/wrid';
import Hls from 'hls.js';
import { 
  getLiveRecommand,
  getLiveStreamUrl,
  getLiveAreaList,
  getLiveCategoryRecommand,
} from '@/api/home/live';
import observeLastEle from '@/utils/observer';

import downIcon from '@/assets/icon/common/down.svg';
import onlineIcon from '@/assets/icon/common/online.svg';

interface AreaItem {
  id: string,
  name: string,
  parent_id?: string,
  parent_name?: string,
}

interface ParentAreaItem {
  id: number,
  name: string,
  list: AreaItem[]
}

interface RcmdLiveItem {
  area_name: string;
  attention: number;
  area_v2_parent_name: string;
  area_v2_name: string;
  area_id: number;
  cover: string;
  description: string;
  head_box: {
    name: string;
    value: string;
    desc: string;
  };
  online: number;
  roomid: number;
  title: string;
  uname: string;
  uid: number;
  watched_show: {
    icon: string;
    text_large: string;
    text_small: string;
  }
}

const emit = defineEmits(['checkIsNewLive', 'scrollToTop']);
const route = useRoute();
// Store 类型推断
const store = useStore();
const sessdata = store.state.userModule.sessdata || '';
// 定义常量和响应式数据
let rcmdLiveRooms = ref<RcmdLiveItem[]>([]);
let curMouseIndex = ref<number>(-1);
let videoRefs = ref<(HTMLVideoElement)[]>([]);
let observer: IntersectionObserver | null = null;

// 状态变量
let isLoading = ref<boolean>(false);
let isLoadingArea = ref<boolean>(false);
let page = 1;
const updatePage = (num: number) => {
  page = num;
};
let pageSize = 20;

// 获取分区列表
let parentAreas: Ref<ParentAreaItem[]> = ref([]);
let currentParentArea: Ref<ParentAreaItem | null> = ref(null);
  // 0 代表没有选择
let curParentId = 0;
const updateCurParentId = (id: number) => {
  curParentId = id;
};
let curAreaId = 0;
const updateCurAreaId = (id: number) => {
  curAreaId = id;
};

const fetchLiveAreaList = async (): Promise<void> => {
  try {
    isLoadingArea.value = true;
    const response = await getLiveAreaList();
    const successAction = R.pipe(
      R.pathOr([], ['data']) as (data: any) => any,
      R.tap((areas: ParentAreaItem[]) => {
        parentAreas.value = areas;
        currentParentArea.value = { id: 0, name: '推荐', list: [] };
      })
    );
    const failAction = R.pipe(
      R.pathOr('', ['message']),
      R.when(
        (message: string) => message !== '' && message !== 'undefined',
        (message: string) => {
            ElMessage.error(message);
            throw new Error(message);
        },
      )
    );
    R.ifElse(
      R.propEq(0, 'code'),
      successAction,
      failAction,
    )(R.path(['data'], response));
  } catch (err) {
    console.log('err fetch', err);
  } finally {
    isLoadingArea.value = false;
  };
};

// 获取推荐视频
let hasMore = true;
const updateHasMore = (status: boolean) => {
  hasMore = status;
};
const fetchLiveRecommand = debounce(async (): Promise<void> => {
  if(!hasMore) return;
  try {
    // 获取用户推荐直播
    if(curParentId === 0) {
      const params = {
        platform: 'web',
        web_location: 444.7,
      };
      const wbi_key = store.state.userModule.wbi_key;
      const { img_key, sub_key } = wbi_key;
      const queryString = encWbi(params, img_key, sub_key);
      const newParams = new URLSearchParams(queryString);
      const paramsObj = Object.fromEntries(newParams.entries());
      const compeleteParams = {
        page: page,
        page_size: pageSize,
        platform: paramsObj.platform,
        web_location: Number(paramsObj.web_location),
        wts: Number(paramsObj.wts),
        w_rid: paramsObj.w_rid,
      };

      const response = await getLiveRecommand(compeleteParams, sessdata);
      const successAction = R.pipe(
        R.applySpec({
          hasMore: R.pathOr<number>(0, ['data', 'has_more']),
          list: R.pathOr<RcmdLiveItem[]>([], ['data', 'list'])
        }),
        R.tap(({ hasMore, list }: { hasMore: number, list: RcmdLiveItem[] }) => {
          updateHasMore(hasMore === 1);
          rcmdLiveRooms.value = [...rcmdLiveRooms.value, ...list];
          updatePage(page + 1);
        })
      );
      const failAction = R.pipe(
        R.pathOr('', ['message']),
        R.when(
          (message: string) => message !== '' && message !== 'undefined',
          (message: string) => {
            ElMessage.error(message);
            throw new Error(message);
          }
        )
      );

      R.ifElse(
        R.propEq(0, 'code'),
        successAction,
        failAction
      )(R.path(['data'], response));
    }
    // 获取分区推荐直播
    else {
      const params = {
        platform: 'web',
        web_location: 444.43,
        parent_area_id: curParentId,
        area_id: curAreaId,
        page: page,
        page_size: pageSize,
      };
      const wbi_key = store.state.userModule.wbi_key;
      const { img_key, sub_key } = wbi_key;
      const queryString = encWbi(params, img_key, sub_key);
      const newParams = new URLSearchParams(queryString);
      const paramsObj = Object.fromEntries(newParams.entries());
      const compeleteParams = {
        ...paramsObj,
        parent_area_id: Number(paramsObj.parent_area_id),
        area_id: Number(paramsObj.area_id),
        page: Number(paramsObj.page),
        platform: paramsObj.platform,
        web_location: Number(paramsObj.web_location),
        wts: Number(paramsObj.wts),
        w_rid: paramsObj.w_rid,
      };
      const response = await getLiveCategoryRecommand(compeleteParams, sessdata);
      const successAction = R.pipe(
        R.applySpec({
          hasMore: R.pathOr<number>(0, ['data', 'has_more']),
          list: R.pathOr<RcmdLiveItem[]>([], ['data', 'list'])
        }),
        R.tap(({ hasMore, list }: { hasMore: number, list: RcmdLiveItem[] }) => {
          updateHasMore(hasMore === 1);
          rcmdLiveRooms.value = [...rcmdLiveRooms.value, ...list];
          updatePage(page + 1);
        })
      );
      const failAction = R.pipe(
        R.pathOr('', ['message']),
        R.when(
          (message: string) => message !== '' && message !== 'undefined',
          (message: string) => {
            ElMessage.error(message);
            throw new Error(message);
          }
        )
      );

      R.ifElse(
        R.propEq(0, 'code'),
        successAction,
        failAction
      )(R.path(['data'], response));
    };
  } catch (err) {
    throw new Error(err as string);
  };
}, 500);
const triggerFetchHomeRecommand = async (...args: Parameters<typeof fetchLiveRecommand>) => {
  try {
    if(!hasMore) return;
    isLoading.value = true;
    await fetchLiveRecommand(...args);
  } finally {
    isLoading.value = false;
  };
};
// 重置推荐视频
const resetRcmdLiveRooms = (): void => {
  updateHasMore(true);
  updatePage(1);
  rcmdLiveRooms.value = [];
};

// 刷新推荐视频
const refreshRcmdVideo = async (): Promise<void> => {
  if (isLoading.value) return;
  resetRcmdLiveRooms();
  try {
    triggerFetchHomeRecommand();
  } catch (err) {
    console.log('err fetch', err);
  };
};

const handleClickParentArea = async (area: ParentAreaItem) => {
  if(!currentParentArea.value || currentParentArea.value.id === area.id) return;
  currentParentArea.value = area;
  updateCurParentId(area.id);
  updateCurAreaId(0);
  resetRcmdLiveRooms();
  updateExtendStatus(false);
  setCategoryChildWrapRef(categoryChildWrapRef.value);
  triggerFetchHomeRecommand();
};

const handleClickChildArea = (area: AreaItem) => {
  if(Number(area.id) === curAreaId) return;
  updateCurAreaId(Number(area.id));
  resetRcmdLiveRooms();
  triggerFetchHomeRecommand();
};

let isExtend: Ref<boolean> = ref(false);
let categoryChildWrapRef = ref<HTMLElement | null>(null);
const updateExtendStatus = (status: boolean) => {
  isExtend.value = status;
};
const categoryChildHeight = 30;
const setCategoryChildWrapRef = (el: HTMLElement | null) => {
  if(!el) return;
  const height = el.scrollHeight;
  if(isExtend.value) {
    el.style.height = `${height}px`;
  } else {
    el.style.height = `${categoryChildHeight}px`;
  };
};

const handleClickExtendBtn = () => {
  updateExtendStatus(!isExtend.value);
  setCategoryChildWrapRef(categoryChildWrapRef.value);
};

let hls: Hls | null = null;
const handleClickRefreshBtn = async (): Promise<void> => {
  await refreshRcmdVideo();
  emit('scrollToTop');
};

const handleMouseEnter = async (item: RcmdLiveItem, index: number): Promise<void> => {
  if (index === curMouseIndex.value) return;
  curMouseIndex.value = index;
  playLive(index, item.roomid);
};
const handleMouseLeave = (index: number): void => {
  curMouseIndex.value = -1;
  if (hls) {
    hls.stopLoad();  // 停止加载
    hls.detachMedia();  // 解除媒体绑定
  };
  stopPlayLive(index);
};
// 获取直播流地址
const fetchLiveStreamUrl = async (roomid: number): Promise<string> => {
  try {
    const response = await getLiveStreamUrl({
      room_id: roomid, 
      protocol: '0,1', 
      format: '0,1,2', 
      codec: '0,1,2',
      qn: 0,
      platform: 'web',
      ptype: 8,
      dolby: 5,
      panorama: 1,
      hdr_type: '0,1',
      req_reason: 0,
    }, sessdata);
    const successAction = R.pipe(
      R.pathOr('', ['data', 'playurl_info', 'playurl', 'stream']) as (data: any) => any,
      R.find(R.propEq('http_hls', 'protocol_name')),
      R.pathOr('', ['format']) as (data: any) => any,
      R.find(R.propEq('ts', 'format_name')),
      R.pathOr('', ['codec']) as (data: any) => any,
      R.find(R.propEq('avc', 'codec_name')),
      ((item: any) => {
        if(item) return item.url_info[0].host + item.base_url + item.url_info[0].extra;
        else return '';
      })
    );
    const failAction = R.pipe(
      R.pathOr('', ['message']),
      R.when(
        (message: string) => message !== '' && message !== 'undefined',
        (message: string) => {
          ElMessage.error(message);
          throw new Error(message);
        }
      ),
      () => ''
    );

    return R.ifElse(
      R.propEq(0, 'code'),
      successAction,
      failAction
    )(R.path(['data'], response));
  } catch (err) {
    console.log('获取直播流地址错误', err);
    return '';
  }
};
const playLive = debounce(async (index: number, roomid: number) => {
  const streamUrl = await fetchLiveStreamUrl(roomid);
  const video = videoRefs.value[index];
  if (video) {
    hls = new Hls();
    // 加载直播流
    hls.loadSource(streamUrl);
    // 将 hls.js 绑定到 video 元素
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
    hls.on(Hls.Events.ERROR, function (_event, data) {
      console.error('HLS加载错误:', data);
    });
  };
});
const stopPlayLive = (index: number) => {
  const video = videoRefs.value[index];
  video.pause();
  video.src = '';
  video.load();
  playLive.cancel();
};


let curPlayerWindowIndex = ref<number>(-1);
const updateCurPlayerWindowIndex = (index: number) => {
  curPlayerWindowIndex.value = index;
};

const checkIsNewVideo = (callback: (isNew: boolean) => unknown, index: number, routePath: string): void => {
  emit('checkIsNewLive', callback, index, routePath);
};

const openPlayerWindow = (item: RcmdLiveItem, index: number, routePath: string) => {
  const roomid = item.roomid;
  const jsonData = JSON.stringify({ windowId: 'live', roomid });
  const callback = (isNew: boolean) => {
    if (isNew) {
      window.electronAPI.sendMessage('player_create', jsonData);
    }
    else {
      window.electronAPI.sendMessage('player_focus', jsonData);
    };
    updateCurPlayerWindowIndex(index);
    stopPlayLive(index);
  };
  checkIsNewVideo(callback, index, routePath);
};

const handleClickLiveRoom = (item: RcmdLiveItem, index: number) => {
  curMouseIndex.value = -1;
  // 防止连接多个 ws
  window.electronAPI.send('player_stop_live_package');
  openPlayerWindow(item, index, route.path);
  updateCurPlayerWindowIndex(index);
  stopPlayLive(index);
};

onActivated(async (): Promise<void> => {
  try {
    triggerFetchHomeRecommand();
  } catch (err) {
    console.log('err fetch', err);
  };
  isLoading.value = false;
  await nextTick();
  const sentinel = document.getElementById('sentinel');
  observer = observeLastEle(sentinel, {}, () => triggerFetchHomeRecommand());
});

onDeactivated(() => {
  if (observer) observer.disconnect();
});

onMounted(() => {
  fetchLiveAreaList();
});
</script>

<style lang='scss' scoped>
  $category-child-height: 30px;
  @media (min-width: 2000px) {
    .content-rcmd {
      --title-font-size: 16px;
      --title-line-height: 24px;
      --subtitle-font-size: 14px;
      --subtitle-line-height: 19px;
      --info-margin-top: 12px;
      --avatar-size: 40px;
      --avatar-margin-right: 12px;
      --icon-size: 20px;
      --title-padding-right: 24px;
    }
  }
  @media (min-width: 1500px) {
    // (1500 - 70 - 40 * 2 - 20 * 4) / 5
    .content-wrap,
    .skeleton-wrap {
      grid-template-columns:
        minmax(240px, 1fr) minmax(240px, 1fr) minmax(240px, 1fr)
        minmax(240px, 1fr) minmax(240px, 1fr);
    }
  }
  // min值必须比 min-width 的 二分之一要小 因为有margin
  @media (max-width: 1500px) {
    // (1000 - 70 - 40 * 2 - 20 * 3) / 4
    .content-wrap,
    .skeleton-wrap {
      grid-template-columns:
        minmax(180px, 1fr) minmax(180px, 1fr) minmax(180px, 1fr)
        minmax(180px, 1fr);
    }
  }
  .container-rcmd {
    box-sizing: border-box;
    min-height: 100%;
    .category-area {
      .category-parent-wrap {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 10px 0;
        color: var(--theme-text-color);
        .category-item {
          padding: 5px 8px;
          margin: 0 10px;
          cursor: pointer;
          transition: .2s;
          &:hover {
            color: var(--brand-pink);
          }
        }
      }
      .category-child {
        color: var(--theme-subtitle-color);
        .category-child-wrap {
          display: flex;
          flex-wrap: wrap;
          transition: .2s;
          height: auto;
          .category-item {
            padding: 0 15px 0 0;
            line-height: $category-child-height;
            cursor: pointer;
            &:hover {
              color: var(--brand-pink);
            }
          }
        }
        .close {
          height: $category-child-height;
          overflow: hidden;
        }
        .extend-btn {
          line-height: $category-child-height;
          width: 100px;
          flex-shrink: 0;
          cursor: pointer;
          .img {
            width: 12px;
            height: 12px;
            transition: .2s;
            transform: rotate(0deg);
            vertical-align: middle;
          }
        }
      }
      .active {
        color: var(--brand-pink);
      }
    }
    .content-rcmd {
      margin-top: 20px;
      --title-font-size: 15px;
      --title-line-height: 22px;
      --subtitle-font-size: 13px;
      --subtitle-line-height: 17px;
      --info-margin-top: 8px;
      --avatar-size: 36px;
      --avatar-margin-right: 8px;
      --icon-size: 18px;
      --title-padding-right: 16px;
      --follow-icon-font-size: 12px;
      --follow-icon-line-height: 17px;
      .content-wrap {
        display: grid;
        grid-gap: 30px 20px;
        margin-bottom: 20px;
        .box-card {
          position: relative;
          box-sizing: border-box;
          .box-card-wrap {
            width: 100%;
            .card-content {
              position: relative;
              width: 100%;
              aspect-ratio: 100 / 56.25;
              border-radius: 5px;
              overflow: hidden;
              transition: 0.2s;
              &:hover {
                transform: scale(1.05);
              }
              .card-cover {
                width: 100%;
                height: 100%;
                z-index: 1;
                .img-wrap {
                  width: 100%;
                  height: 100%;
                  background-color: var(--graph_bg_regular);
                  img {
                    width: 100%;
                    height: 100%;
                  }
                }

                .card-mask {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  .card-mask-info {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    padding: 14px 8px 6px;
                    height: 38px;
                    width: 100%;
                    box-sizing: border-box;
                    background-image: linear-gradient(
                      180deg,
                      rgba(0, 0, 0, 0) 0%,
                      rgba(0, 0, 0, 0.8) 100%
                    );
                    color: #fff;
                    font-size: var(--subtitle-font-size);
                    line-height: var(--icon-size);
                    .card-mask-info-left {
                      .card-mask-icon {
                        width: var(--icon-size);
                        height: var(--icon-size);
                      }
                    }
                  }
                }
              }

              .card-inline-player {
                position: absolute;
                left: 0;
                top: 0;
                z-index: 2;
                width: 100%;
                height: 100%;
                .card-player-area {
                  width: 100%;
                  height: 100%;
                  background-color: #000;
                  .card-video-wrap {
                    width: 100%;
                    height: 100%;
                    color: #fff;
                    video {
                      width: 100%;
                      height: 100%;
                    }
                  }
                }
              }
              .invisible {
                opacity: 0;
              }
            }
            .card-info {
              width: 100%;
              margin-top: var(--info-margin-top);
              height: calc(3 * var(--title-line-height));
              .card-title {
                transition: 0.2s;
                // 多行文本溢出省略号
                display: -webkit-box;
                -webkit-box-orient: vertical; /* 垂直排列 */
                overflow: hidden; /* 隐藏超出部分 */
                text-overflow: ellipsis; /* 使用省略号表示超出部分 */
                -webkit-line-clamp: 1; /* 限制行数，根据需要调整 */
                height: calc(1 * var(--title-line-height));
                line-height: var(--title-line-height);
                color: var(--theme-text-color);
                font-size: var(--title-font-size);
                &:hover {
                  color: var(--brand-pink);
                }
              }
              .card-info-bottom {
                margin-top: 4px;
                .card-info-owner {
                  transition: 0.2s;
                  font-size: var(--subtitle-font-size);
                  color: var(--theme-subtitle-color);
                  &:hover {
                    color: var(--brand-pink);
                  }
                  .card-svg {
                    width: var(--subtitle-line-height);
                    height: var(--subtitle-line-height);
                  }
                  .card-info-bottom-text {
                    color: #ff7f24;
                    background-color: var(--video-card-reason);
                    padding: 0 4px;
                    margin-right: 4px;
                    border-radius: 3px;
                    font-size: var(--follow-icon-font-size);
                    line-height: var(--follow-icon-line-height);
                  }
                  .card-info-bottom-author {
                    line-height: var(--subtitle-line-height);
                  }
                }
              }
            }
          }
        }
      }
      .skeleton-wrap {
        display: grid;
        grid-gap: 30px 20px;
        margin-bottom: 20px;
        .box-card-skeleton {
          pointer-events: none;
          user-select: none;
          width: 100%;
          height: 100%;
          .card-skeleton-cover {
            padding-top: var(--cover-radio);
            background: linear-gradient(
              -45deg,
              var(--graph_bg_regular) 25%,
              var(--bg1) 45%,
              var(--graph_bg_regular) 65%
            );
            background-size: 400% 100%;
            animation: skeleton-loading 1.2s ease-in-out infinite;
            border-radius: 5px;
          }
          @keyframes skeleton-loading {
            0% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0 50%;
            }
          }
          .card-skeleton-info {
            margin-top: var(--info-margin-top);
            .card-skeleton-text {
              margin-bottom: 4px;
              width: 94%;
              height: calc(var(--title-line-height) - 4px);
              border-radius: 4px;
              background-color: var(--graph_bg_regular);
            }
            .short {
              width: 74%;
            }
            .card-skeleton-text-light {
              margin-top: 8px;
              width: 50%;
              height: var(--subtitle-line-height);
              border-radius: 4px;
              background-color: var(--graph_bg_regular);
            }
          }
        }
      }
    }
    .refresh-btn-rcmd {
      position: fixed;
      bottom: 50px;
      right: 16px;
      width: 40px;
      height: 40px;
      background-color: var(--bg1-float);
      color: var(--theme-text-color);
      border-radius: 7px;
      overflow: hidden;
      box-shadow: 0px 0px 3px var(--bg1-float-hover);
      transition: .3s;
      &:hover {
        background-color: var(--bg1-float-hover);
      }
      svg {
        width: 24px;
        height: 24px;
      }
    }
    .theme-failed {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
  }
  #sentinel {
    width: 100%;
    height: 1px;
  }
</style>
