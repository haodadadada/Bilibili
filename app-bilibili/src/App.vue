<template>
  <div class="root-container" ref="containerRef">
    <div class="side">
      <Sidebar></Sidebar>
    </div>
    <div class="root-content">
      <Navbar @exit="handleExit" :navItems="navItems"></Navbar>
      <router-view v-slot="{ Component }">
        <transition mode="out-in">
          <keep-alive>
            <component :is="Component" @changeSize="handleResize" @updateNav="handleUpdateNavList"/>
          </keep-alive>
        </transition>
      </router-view>
      <transition mode="out-in">
        <ExitDialog v-if="isShow">
          <div class="flex-column flex-between popup">
            <div class="flex-end close" @click="handleClickCloseBtn">
              <component :is="closeImg" class="img"></component>
            </div>
            <div class="flex-start flex-column dialog-content flex-1">
              <div class="text-[16px] weight-6 mb-15 item title">点击关闭按钮以后：</div>
              <div class="text-[13px] mb-10 item">
                  <input type="radio" id="hide" name="close" :value="0" v-model="selectIndex">
                  <label for="hide">最小化到系统托盘</label>                
              </div>
              <div class="text-[13px] item">
                  <input type="radio" id="exit" name="close" :value="1" v-model="selectIndex">
                  <label for="exit">退出应用</label>
              </div>
            </div>
            <div class="flex-between bottom_button">
                <div class="mr-15 cancel flex-center" @click="handleClickCloseBtn">
                  <span class="text-[13px]">取消</span>
                </div>
                <div class="sure flex-center" @click="handleClickConfirmBtn(selectIndex)">
                  <span class="text-[13px]">确定</span>
                </div>
            </div>
          </div>
        </ExitDialog>
      </transition>
    </div>
  </div>
</template>

<script setup lang="js">
  import { onMounted, ref, onUnmounted, nextTick } from 'vue';
  import { useStore } from 'vuex';
  import Sidebar from '@/components/Sidebar/index.vue';
  import Navbar from '@/components/Navbar/index.vue';
  import ExitDialog from '@/components/Dialog/index.vue';
  import { debounceSetContainerHeight } from '@/utils/container';

  import closeImg from '@/assets/icon/common/close.svg';

  const store = useStore();
  let isShow = ref(false);
  const updateIsShow = (state) => {
    isShow.value = state;
  };
  let containerRef = ref();
  let handleResize = () => {
    debounceSetContainerHeight({containerRef});
  };
  let navItems = ref([]);
  const handleUpdateNavList = list => {
    navItems.value = list;
  };
  let removeLoginListener = null;
  const watchLoginStateUpdate = () => {
    removeLoginListener = window.electronAPI.receive('update_login_to_main', () => {
      location.reload();
    });
  };

  let selectIndex = ref(0);
  const handleClickConfirmBtn = async (selected) => {
    await exitOrMinimizeAction(selected);
  };
  const exitOrMinimizeAction = async (selected) => {
    if(selected === 0) {
      updateIsShow(false);
    };
    // 等待弹出框关闭后在缩小窗口 防止重新打开时弹出框关闭动画未结束
    await nextTick();
    window.electronAPI.sendMessage('app_exit', selected);
  };
  const handleClickCloseBtn = () => {
    updateIsShow(false);
  };

  const handleExit = async () => {
    const configData = await window.electronAPI.invoke('get_setting');
    const closeMainChoice = configData.common.closeMain.index;

    const isClosePrompt = configData.common.isShowCloseMainPrompt;
    
    if(!isClosePrompt) {
      exitOrMinimizeAction(closeMainChoice);
      return;
    }
    else {
      selectIndex.value = closeMainChoice;
      updateIsShow(true);
    };
  };

  /**
   * @returns true为深色模式 false为浅色模式
   */
  const getSystemColorMode = async () => {
    try {
      return await window.electronAPI.invoke('main_get_system_color_mode');
    } catch(err) {
      console.log('获取系统颜色模式失败', err);
    };
  };

  const setThemeColor = async (configData) => {
    const themeColorChoice = configData.common.theme.index;
    switch (themeColorChoice) {
      case 1: {
        const systemColorMode = await getSystemColorMode();
        if(systemColorMode) {
          store.commit('userModule/changeUserLight', false);
          document.documentElement.dataset.theme = 'dark';
        }
        else {
          store.commit('userModule/changeUserLight', true);
          document.documentElement.dataset.theme = 'light';
        };
        break;
      }
      case 2: {
        store.commit('userModule/changeUserLight', true);
        document.documentElement.dataset.theme = 'light';
        break;
      }
      case 3: {
        store.commit('userModule/changeUserLight', false);
        document.documentElement.dataset.theme = 'dark';
        break;
      }
    };
  };


  const setFontFamily = async (configData) => {
    const fontChoice = configData.common.fontFamily.index;
    if(fontChoice === 0) {
      document.body.style.fontFamily = 'system-ui, sans-serif';
    }
    else if(fontChoice === 1) {
      document.body.style.fontFamily = 'HarmonyOS Sans, sans-serif';
    };
  };
 
  const initSystemConfiguration = async () => {
    const configData = await window.electronAPI.invoke('get_setting');
    await setThemeColor(configData);
    await setFontFamily(configData);
  };

  const removeFontListener = window.electronAPI.receive('update_font_to_main', (message) => {
    const { fontIndex } = JSON.parse(message);
    if(fontIndex === 0) {
      document.body.style.fontFamily = 'system-ui, sans-serif';
      return;
    }
    else if(fontIndex === 1) {
      document.body.style.fontFamily = 'HarmonyOS Sans, sans-serif';
      return;
    };
  });

  onMounted(async () => {
    handleResize();
    window.addEventListener('resize', handleResize);
    watchLoginStateUpdate();
    await initSystemConfiguration();
  });

  onUnmounted(() => {
    if(removeLoginListener) {
      removeLoginListener();
    };
    if(removeFontListener) {
      removeFontListener();
    };
    window.removeEventListener('resize', handleResize);
  });

 
</script>
 
<style lang="scss">
* {
  padding: 0;
  margin: 0;
  user-select: none;
  -webkit-user-drag: none;
}
$sideWidth: var(--side-width);

.root-container {
  display: flex;
  height: 100vh;
  box-sizing: border-box;
  .side {
    width: $sideWidth; 
    height: 100%;
  }
  .root-content {
    width: calc(100% - $sideWidth);
    min-height: 100%;
    .popup {
      width: 100%;
      height: 100%;
      color: var(--theme-text-color);
      .close {
        .img {
          width: 20px;
          height: 20px;
          padding: 5px;
          border-radius: 3px;
          text-align: center;
          transition: .2s;
          cursor: pointer;
          &:hover {
            background-color: var(--theme-hover-color);
          }
        }
      }
      .dialog-content {
        .title {
          text-align: center;
        }
        .item {
          width: 70%;
          input[type="radio"] {
            position: relative;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin: 0 10px;
          }
          input[type="radio"]::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: calc(100% + 5px);
            height: calc(100% + 5px);
            border-radius: 50%;
            background-color: #fff;
            border: 1px solid var(--button-border-color);
            transition: .3s;
            box-sizing: border-box;
            z-index: 1;
          }
          input[type="radio"]:hover::after {
            border: 1px solid var(--brand-pink);
          }
          input[type="radio"]:checked::after {
            border: 1px solid var(--brand-pink);
          }
          input[type="radio"]::before {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: calc(100% - 2px);
            height: calc(100% - 2px);
            border-radius: 50%;
            background-color: var(--brand-pink);
            opacity: 0;
            transition: .3s;
            z-index: 2;
          }
          input[type="radio"]:checked::before {
            opacity: 1;
          }
          label {
            color: #aaa;
            cursor: pointer;
          }
        }
      }
      .bottom_button {
        div {
          cursor: pointer;
          border-radius: 5px;
          flex: 1;
          text-align: center;
          padding: 5px 0;
          transition: .2s;
        }
        .cancel {
          border: 1px solid var(--button-border-color);
          &:hover {
            background-color: var(--theme-hover-color);
          }
        }
        .sure {
          background-color: var(--brand-pink);
          color: #fff;
          &:hover {
            background-color: var(--brand-pink-dark);
          }
        }
      }
    }
  }
}

body::-webkit-scrollbar {
  display: none;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
} 

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>
