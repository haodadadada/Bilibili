<template>
    <div class="player-content flex-center flex-col">
        <header class="header-info flex items-center justify-between">
            <div class="left flex items-center">
                <img :src="`${ liveAnchorInfo.info.face }@100w_100h.webp`" alt="" v-if="liveAnchorInfo" class="size-[68px] rounded-[50%]" referrerpolicy="no-referrer">
                <div class="text flex flex-col ml-10 justify-between select-none">
                    <span v-if="liveAnchorInfo" class="text-hover-color text-[15px]">{{ liveAnchorInfo.info.uname }}</span>
                    <div v-if="liveRoomInfo" class="text-[12px] font-semibold">
                        <span style="color: #E9CD2F;" class="mr-10">{{ liveRoomInfo.title }}</span>
                        <span class="text-hover-color">{{ liveRoomInfo.area_name }}</span>
                    </div>
                </div>
            </div>
            <div class="right text-[12px] flex items-start pt-10 select-none">
                <div v-if="roomMsg.watcherCount" class="flex items-center mr-10">
                    <component :is='onlineIcon' class='size-[15px] mr-5'></component>
                    <span class="text-hover-color">{{ roomMsg.watcherCount }}</span>
                </div>
                <div v-if="roomMsg.likeCount" class="flex items-center">
                    <component :is='likeIcon' class='size-[15px] mr-3'></component>
                    <span class="text-hover-color">{{ roomMsg.likeCount }}</span>
                </div>
            </div>
        </header>
        <div class="player-live-area flex-center flex-1" v-ratio="{ ratio: 1.7 }">
            <div class="player-live-wrap flex-center">
                <video crossorigin="anonymous" preload="auto" ref="playerRef"></video>
            </div>
            <div class="player-live-control" 
                @mousemove="handleControlMouseMove" 
                @mouseleave="handleControlMouseLeave" 
                ref="playerControlRef"
            >
                <transition name="player-control-fade">
                    <div class="player-control-wrap" 
                        @click="(event) => event.stopPropagation()" 
                        @mousemove="handleControlBottomMouseMove"
                        v-show="isMouseMoving"
                    >
                        <div class="player-control-mask"></div>
                        <!-- 控件区域 -->
                        <div class="player-control-bottom flex select-none">
                            <div class="player-control-bottom-left flex-start flex-1">
                                <div class="player-ctrl-btn player-ctrl-play player-control-hover" @click="handleClickCtrlBtn">
                                    <svg 
                                        v-if="!isPlaying"
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 28 28" 
                                        width="28" 
                                        height="28" 
                                        preserveAspectRatio="xMidYMid meet" 
                                        style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
                                        <defs>
                                            <clipPath id="__lottie_element_1281">
                                                <rect width="28" height="28" x="0" y="0"></rect>
                                            </clipPath>
                                        </defs>
                                        <g clip-path="url(#__lottie_element_1281)">
                                            <g transform="matrix(0.22383984923362732,0,0,0.22383984923362732,20.641138076782227,14.097020149230957)" opacity="0.002394794788986161" style="display: none;">
                                                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                    <path fill="rgb(255,255,255)" fill-opacity="1" d=" M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 
                                                    -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,7.995999813079834 
                                                    -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z">
                                                    </path>
                                                    <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(255,255,255)" stroke-opacity="1" stroke-width="0" d=" M-5.484000205993652,-10 C-7.953000068664551,-10
                                                    -8,-7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668
                                                    -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,-8 
                                                    -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z">
                                                    </path>
                                                </g>
                                            </g>
                                            <g transform="matrix(0.6509166955947876,0,0,0.6509166955947876,22.417274475097656,14)" 
                                                    opacity="0.002459409968898996" style="display: none;">
                                                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                    <path fill="rgb(255,255,255)" fill-opacity="1" d=" M-5.484000205993652,-10 C-7.953000068664551,-10 
                                                    -8,-7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,
                                                    9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,
                                                    -8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z">
                                                    </path>
                                                    <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" 
                                                        stroke="rgb(255,255,255)" stroke-opacity="1" stroke-width="0" d=" M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,
                                                        7.984000205993652 -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,
                                                        7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z">
                                                    </path>
                                                </g>
                                            </g>
                                            <g style="display: block;" transform="matrix(1,0,0,1,14,14)" opacity="1">
                                                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                    <path fill="rgb(255,255,255)" fill-opacity="1" d="M0 0"></path>
                                                    <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(255,255,255)" stroke-opacity="1" stroke-width="0" d="M0 0"></path>
                                                </g>
                                                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                    <path fill="rgb(255,255,255)" fill-opacity="1" d=" M-7.031000137329102,-10.875 C-7.031000137329102,-10.875 -8.32800006866455,-11.25 -9.42199993133545,-10.468999862670898 
                                                    C-10.109999656677246,-9.906999588012695 -10,-7.992000102996826 -10,-7.992000102996826 C-10,-7.992000102996826 -10,8.015999794006348 -10,8.015999794006348 C-10,8.015999794006348 -10.125,10.241999626159668 
                                                    -9,10.991999626159668 C-7.875,11.741999626159668 -5,10.031000137329102 -5,10.031000137329102 C-5,10.031000137329102 7.968999862670898,1.875 7.968999862670898,1.875 C7.968999862670898,1.875 9,1.062000036239624 9,
                                                    0 C9,-1.062000036239624 7.968999862670898,-1.937999963760376 7.968999862670898,-1.937999963760376 C7.968999862670898,-1.937999963760376 -7.031000137329102,-10.875 -7.031000137329102,-10.875z"></path>
                                                    <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(255,255,255)" stroke-opacity="1" stroke-width="0" d=" M-7.031000137329102,-10.875 C-7.031000137329102,-10.875 
                                                    -8.32800006866455,-11.25 -9.42199993133545,-10.468999862670898 C-10.109999656677246,-9.906999588012695 -10,-7.992000102996826 -10,-7.992000102996826 C-10,-7.992000102996826 -10,8.015999794006348 -10,8.015999794006348 
                                                    C-10,8.015999794006348 -10.125,10.241999626159668 -9,10.991999626159668 C-7.875,11.741999626159668 -5,10.031000137329102 -5,10.031000137329102 C-5,10.031000137329102 7.968999862670898,1.875 7.968999862670898,1.875 
                                                    C7.968999862670898,1.875 9,1.062000036239624 9,0 C9,-1.062000036239624 7.968999862670898,-1.937999963760376 7.968999862670898,-1.937999963760376 C7.968999862670898,-1.937999963760376 -7.031000137329102,-10.875 
                                                    -7.031000137329102,-10.875z">
                                                    </path>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" preserveAspectRatio="xMidYMid meet" 
                                    style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
                                        <defs>
                                            <clipPath id="__lottie_element_403">
                                                <rect width="28" height="28" x="0" y="0">
                                                </rect>
                                            </clipPath>
                                        </defs>
                                        <g clip-path="url(#__lottie_element_403)">
                                            <g transform="matrix(1,0,0,1,14,14)" opacity="1" style="display: block;">
                                                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                    <path fill="rgb(255,255,255)" fill-opacity="1" d=" M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 
                                                        -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 
                                                        C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,
                                                        9.991999626159668 -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,
                                                        7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,
                                                        -10 -5.484000205993652,-10z">
                                                    </path>
                                                    <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(255,255,255)" 
                                                        stroke-opacity="1" stroke-width="0" d=" M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 -8,
                                                        -7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 
                                                        C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,
                                                        9.991999626159668 -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,
                                                        7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,
                                                        -10 -5.484000205993652,-10z">
                                                    </path>
                                                </g>
                                            </g>
                                            <g transform="matrix(0.9999996423721313,0,0,0.9999996423721313,
                                                24.812000274658203,14)" opacity="1" style="display: block;">
                                                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                    <path fill="rgb(255,255,255)" fill-opacity="1" d=" M-5.484000205993652,-10 C-7.953000068664551,-10 -8,
                                                        -7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 
                                                        -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 
                                                        -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,7.995999813079834 
                                                        -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,
                                                        -8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z">
                                                    </path>
                                                    <path stroke-linecap="butt" 
                                                        stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(255,255,255)" stroke-opacity="1" 
                                                        stroke-width="0" d=" M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 -8,-7.984000205993652 
                                                        C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 C-8.008000373840332,
                                                        7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 
                                                        -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 
                                                        -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z">
                                                    </path>
                                                </g>
                                            </g>
                                            <g transform="matrix(1,0,0,1,4.000003814697266,14)" opacity="0.0000019383089441760147" style="display: block;">
                                                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                    <path fill="rgb(255,255,255)" fill-opacity="1" d="M0 0">
                                                    </path>
                                                    <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(255,255,255)" 
                                                        stroke-opacity="1" stroke-width="0" d="M0 0">
                                                    </path>
                                                </g>
                                                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                    <path fill="rgb(255,255,255)" fill-opacity="1" d=" M-7.031000137329102,-10.875 C-7.031000137329102,-10.875
                                                        -8.32800006866455,-11.25 -9.42199993133545,-10.468999862670898 C-10.109999656677246,-9.906999588012695 -10,
                                                        -7.992000102996826 -10,-7.992000102996826 C-10,-7.992000102996826 -10,8.015999794006348 -10,8.015999794006348 
                                                        C-10,8.015999794006348 -10.125,10.241999626159668 -9,10.991999626159668 C-7.875,11.741999626159668 -5,
                                                        10.031000137329102 -5,10.031000137329102 C-5,10.031000137329102 7.968999862670898,1.875 7.968999862670898,1.875 
                                                        C7.968999862670898,1.875 9,1.062000036239624 9,0 C9,-1.062000036239624 7.968999862670898,-1.937999963760376 
                                                        7.968999862670898,-1.937999963760376 C7.968999862670898,-1.937999963760376 -7.031000137329102,-10.875 
                                                        -7.031000137329102,-10.875z">
                                                    </path>
                                                    <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" 
                                                        stroke-miterlimit="4" stroke="rgb(255,255,255)" stroke-opacity="1" stroke-width="0" d=" M-7.031000137329102,
                                                        -10.875 C-7.031000137329102,-10.875 -8.32800006866455,-11.25 -9.42199993133545,-10.468999862670898 
                                                        C-10.109999656677246,-9.906999588012695 -10,-7.992000102996826 -10,-7.992000102996826 C-10,-7.992000102996826 -10,
                                                        8.015999794006348 -10,8.015999794006348 C-10,8.015999794006348 -10.125,10.241999626159668 -9,10.991999626159668
                                                        C-7.875,11.741999626159668 -5,10.031000137329102 -5,10.031000137329102 C-5,10.031000137329102 7.968999862670898,
                                                        1.875 7.968999862670898,1.875 C7.968999862670898,1.875 9,1.062000036239624 9,0 C9,-1.062000036239624 
                                                        7.968999862670898,-1.937999963760376 7.968999862670898,-1.937999963760376 C7.968999862670898,-1.937999963760376 
                                                        -7.031000137329102,-10.875 -7.031000137329102,-10.875z">
                                                    </path>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            <div class="player-control-bottom-right flex-end flex-1">
                                <!-- 清晰度 -->
                                <div 
                                    class="player-ctrl-quality player-ctrl-btn player-control-hover text-[14px] font-semibold"
                                    v-if="curQualityValue"
                                    @mouseenter="handleMouseEnterQulity" 
                                    @mouseleave="handleMouseLeaveQulityDebounce"
                                >
                                    <transition name="opacity-fade">
                                        <ul class="player-ctrl-quality-menu font-medium" v-if="isShowQuality">
                                            <li 
                                                class="player-ctrl-quality-item"
                                                :class="{ 'player-ctrl-quality-item-active': qualityItem.qn == curQuality }"
                                                @click="handleQualityMenuItemClick(qualityItem.qn)"
                                                v-for="qualityItem of qualityOptional"
                                                :key="qualityItem.qn"
                                            >
                                            {{ qualityItem.desc }}
                                            </li>
                                        </ul>
                                    </transition>
                                    <div 
                                        class="player-ctrl-quality-result" 
                                    >
                                        {{ curQualityValue }}
                                    </div>
                                </div>
                                <div class="player-danmaku-area flex-start">
                                    <div class="player-danmaku-switch" @click="handleClickDanmakuSwitchBtn">
                                        <svg xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 24 24"  v-if="!isDanmakuClosed">
                                            <path fill-rule="evenodd" d="M11.989 4.828c-.47 0-.975.004-1.515.012l-1.71-2.566a1.008 1.008 0 0 0-1.678 1.118l.999 
                                                1.5c-.681.018-1.403.04-2.164.068a4.013 4.013 0 0 0-3.83 3.44c-.165 1.15-.245 2.545-.245 4.185 0 1.965.115 3.67.35 5.116a4.012 
                                                4.012 0 0 0 3.763 3.363l.906.046c1.205.063 1.808.095 3.607.095a.988.988 0 0 0 
                                                0-1.975c-1.758 0-2.339-.03-3.501-.092l-.915-.047a2.037 2.037 0 0 1-1.91-1.708c-.216-1.324-.325-2.924-.325-4.798 
                                                0-1.563.076-2.864.225-3.904.14-.977.96-1.713 1.945-1.747 2.444-.087 4.465-.13 6.063-.131 1.598 0 3.62.044 6.064.13.96.034 
                                                1.71.81 1.855 1.814.075.524.113 1.962.141 3.065v.002c.01.342.017.65.025.88a.987.987 0 1 0 
                                                1.974-.068c-.008-.226-.016-.523-.025-.856v-.027c-.03-1.118-.073-2.663-.16-3.276-.273-1.906-1.783-3.438-3.74-3.507-.9-.032-1.743-.058-2.531-.078l1.05-1.46a1.008 1.008 
                                                0 0 0-1.638-1.177l-1.862 2.59c-.38-.004-.744-.007-1.088-.007h-.13Zm.521 4.775h-1.32v4.631h2.222v.847h-2.618v1.078h2.618l.003.678c.36.026.714.163 
                                                1.01.407h.11v-1.085h2.694v-1.078h-2.695v-.847H16.8v-4.63h-1.276a8.59 8.59 0 0 0 .748-1.42L15.183 7.8a14.232 14.232 0 0 1-.814 1.804h-1.518l.693-.308a8.862 8.862 0 0 
                                                0-.814-1.408l-1.045.352c.297.396.572.847.825 1.364Zm-4.18 3.564.154-1.485h1.98V8.294h-3.2v.98H9.33v1.43H7.472l-.308 3.453h2.277c0 1.166-.044 
                                                1.925-.12 2.277-.078.352-.386.528-.936.528-.308 0-.616-.022-.902-.055l.297 1.067.062.005c.285.02.551.04.818.04 1.001-.067 
                                                1.562-.419 1.694-1.057.11-.638.176-1.903.176-3.795h-2.2Zm7.458.11v-.858h-1.254v.858h1.254Zm-2.376-.858v.858h-1.199v-.858h1.2Zm-1.199-.946h1.2v-.902h-1.2v.902Zm2.321 0v-.902h1.254v.902h-1.254Z" 
                                                clip-rule="evenodd">
                                            </path>
                                            <path fill="#FF6699" fill-rule="evenodd" d="M22.846 14.627a1 1 0 0 0-1.412.075l-5.091 5.703-2.216-2.275-.097-.086-.008-.005a1 1 0 0 
                                                0-1.322 1.493l2.963 3.041.093.083.007.005c.407.315 1 .27 1.354-.124l5.81-6.505.08-.102.005-.008a1 1 0 0 0-.166-1.295Z" 
                                                clip-rule="evenodd">
                                            </path>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 24 24" v-if="isDanmakuClosed">
                                            <path 
                                                fill-rule="evenodd" 
                                                clip-rule="evenodd" 
                                                d="m8.085 4.891-.999-1.499a1.008 1.008 0 0 1 1.679-1.118l1.709 2.566c.54-.008 1.045-.012 1.515-.012h.13c.345 0 .707.003 1.088.007l1.862-2.59a1.008 1.008 0 0 1 1.637 1.177l-1.049 1.46c.788.02 1.631.046 2.53.078 
                                                1.958.069 3.468 1.6 3.74 3.507.088.613.13 2.158.16 3.276l.001.027c.01.333.017.63.025.856a.987.987 0 0 
                                                1-1.974.069c-.008-.23-.016-.539-.025-.881v-.002c-.028-1.103-.066-2.541-.142-3.065-.143-1.004-.895-1.78-1.854-1.813-2.444-.087-4.466-.13-6.064-.131-1.598 0-3.619.044-6.063.13a2.037 2.037 0 0 0-1.945 1.748c-.15 
                                                1.04-.225 2.341-.225 3.904 0 1.874.11 3.474.325 4.798.154.949.95 1.66 1.91 1.708a97.58 97.58 0 0 0 5.416.139.988.988 0 0 1 0 1.975c-2.196 0-3.61-.047-5.513-.141A4.012 4.012 0 0 1 2.197 
                                                17.7c-.236-1.446-.351-3.151-.351-5.116 0-1.64.08-3.035.245-4.184A4.013 4.013 0 0 1 5.92 4.96c.761-.027 1.483-.05 2.164-.069Z"
                                            />
                                            <path 
                                                d="m12.521 9.598h-1.32v4.63h2.222v.848h-2.618v1.078h2.431a5.01 5.01 0 0 1 3.575-3.115V9.598h-1.276a8.59 8.59 0 0 0 .748-1.42l-1.089-.384a14.232 14.232 0 0 1-.814 1.804h-1.518l.693-.308a8.862 8.862 0 0 
                                                0-.814-1.408l-1.045.352c.297.396.572.847.825 1.364Z"
                                            />
                                            <path 
                                                d="m8.341 12.962.154-1.485h1.98V8.289h-3.2v.979h2.067v1.43H7.483l-.308 3.454h2.277c0 1.166-.044 1.925-.12 2.277-.078.352-.386.528-.936.528-.308 0-.616-.022-.902-.055l.297 
                                                1.067.062.004c.285.02.551.04.818.04 1.001-.066 1.562-.418 1.694-1.056.11-.638.176-1.903.176-3.795h-2.2Z"
                                            />
                                            <path 
                                                d="m15.8 11.218v-.858h-1.254v.858H15.8Zm-2.376-.858v.858h-1.199v-.858h1.2Zm-1.199-.946h1.2v-.902h-1.2v.902Zm2.321 0v-.902H15.8v.902h-1.254Z"
                                            />
                                            <path 
                                                d="m19.337 21.458a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-.002-1.502a2.5 2.5 0 0 1-2.217-3.657l3.326 3.398a2.49 2.49 0 0 1-1.109.259Zm2.5-2.5c0 .42-.103.815-.286 1.162l-3.328-3.401a2.5 2.5 0 0 1 3.614 2.239Z"
                                            />
                                        </svg>
                                    </div>
                                    <div class="player-danmaku-setting" @mouseenter="handleMouseEnterDanmakuSetting" @mouseleave="handleMouseLeaveDanmakuSettingDebounce">
                                        <svg xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 24 24">
                                            <path fill-rule="evenodd" d="m15.645 4.881 
                                                1.06-1.473a.998.998 0 1 0-1.622-1.166L13.22 4.835a110.67 110.67 0 0 0-1.1-.007h-.131c-.47 0-.975.004-1.515.012L8.783 
                                                2.3A.998.998 0 0 0 7.12 3.408l.988 1.484c-.688.019-1.418.042-2.188.069a4.013 4.013 0 0 0-3.83 3.44c-.165 1.15-.245 2.545-.245 
                                                4.185 0 1.965.115 3.67.35 5.116a4.012 4.012 0 0 0 3.763 3.363c1.903.094 3.317.141 5.513.141a.988.988 0 0 0 0-1.975 97.58 97.58 
                                                0 0 1-5.416-.139 2.037 2.037 0 0 1-1.91-1.708c-.216-1.324-.325-2.924-.325-4.798 0-1.563.076-2.864.225-3.904.14-.977.96-1.713 
                                                1.945-1.747 2.444-.087 4.465-.13 6.063-.131 1.598 0 3.62.044 6.064.13.96.034 1.71.81 1.855 1.814.075.524.113 1.962.141 
                                                3.065v.002c.005.183.01.07.014-.038.004-.096.008-.189.011-.081a.987.987 0 1 0 1.974-.069c-.004-.105-.007-.009-.011.09-.002.056-.004.112-.007.135l-.002.01a.574.574 
                                                0 0 1-.005-.091v-.027c-.03-1.118-.073-2.663-.16-3.276-.273-1.906-1.783-3.438-3.74-3.507-.905-.032-1.752-.058-2.543-.079Zm-3.113 4.703h-1.307v4.643h2.2v.04l.651-1.234c.113-.215.281-.389.482-.509v-.11h.235c.137-.049.283-.074.433-.074h1.553V9.584h-1.264a8.5 
                                                8.5 0 0 0 .741-1.405l-1.078-.381c-.24.631-.501 1.23-.806 1.786h-1.503l.686-.305c-.228-.501-.5-.959-.806-1.394l-1.034.348c.294.392.566.839.817 1.35Zm-1.7 
                                                5.502h2.16l-.564 1.068h-1.595v-1.068Zm-2.498-1.863.152-1.561h1.96V8.289H7.277v.969h2.048v1.435h-1.84l-.306 3.51h2.254c0 1.155-.043 1.906-.12 
                                                2.255-.076.348-.38.523-.925.523-.305 0-.61-.022-.893-.055l.294 1.056.061.005c.282.02.546.039.81.039.991-.065 1.547-.414 1.677-1.046.11-.631.175-1.883.175-3.757H8.334Zm5.09-.8v.85h-1.188v-.85h1.187Zm-1.188-.955h1.187v-.893h-1.187v.893Zm2.322.007v-.893h1.241v.893h-1.241Zm.528 
                                                2.757a1.26 1.26 0 0 1 1.087-.627l4.003-.009a1.26 1.26 0 0 1 1.094.63l1.721 2.982c.226.39.225.872-.001 1.263l-1.743 3a1.26 1.26 0 0 1-1.086.628l-4.003.009a1.26 
                                                1.26 0 0 1-1.094-.63l-1.722-2.982a1.26 1.26 0 0 1 .002-1.263l1.742-3Zm1.967.858a1.26 1.26 0 0 0-1.08.614l-.903 1.513a1.26 1.26 0 0 0-.002 1.289l.885 1.492c.227.384.64.62 
                                                1.086.618l2.192-.005a1.26 1.26 0 0 0 1.08-.615l.904-1.518a1.26 1.26 0 0 0 .001-1.288l-.884-1.489a1.26 1.26 0 0 0-1.086-.616l-2.193.005Zm2.517 2.76a1.4 1.4 0 1 1-2.8 0 1.4
                                                1.4 0 0 1 2.8 0Z" clip-rule="evenodd">
                                            </path>
                                        </svg>
                                        <!-- 弹幕设置弹出框 -->
                                        <transition name="opacity-fade">
                                            <div class="setting-wrap" v-if="isShowSetting">
                                                <div class="setting-show-wrap">
                                                    <span class="text-[12px] mr-5">显示区域</span>
                                                        <div class="setting-show-area" :style="{'--showArea': `${danmakuShowArea}%`}">
                                                            <div class="setting-show-empty"></div>
                                                            <div class="setting-show-fill"></div>
                                                            <input 
                                                                class="danmaku-setting-slider danmaku-setting-step"
                                                                v-model="danmakuShowArea"
                                                                type="range" 
                                                                max="100" 
                                                                min="0" 
                                                                step="25"
                                                            >
                                                        </div>
                                                    <span class="text-[12px] ml-10 progress-val">{{ realDanmakuShowArea }}%</span>
                                                </div>
                                                <div class="setting-opacity-wrap mt-5">
                                                    <span class="text-[12px] mr-5">不透明度</span>
                                                    <div class="setting-opacity-area" :style="{'--opacity': `${getProgressLeftNum(danmakuOpacity, 10, 100)}%`}">
                                                            <div class="setting-opacity-empty"></div>
                                                            <div class="setting-opacity-fill"></div>
                                                            <input 
                                                                class="danmaku-setting-slider"
                                                                v-model="danmakuOpacity"
                                                                type="range" 
                                                                max="100" 
                                                                min="10"
                                                                step="1"
                                                            >
                                                        </div>
                                                    <span class="text-[12px] ml-10 progress-val">{{ danmakuOpacity }}%</span>
                                                </div>
                                                <div class="setting-size-wrap mt-5">
                                                    <span class="text-[12px] mr-5">弹幕字号</span>
                                                    <div class="setting-size-area" :style="{'--size': `${getProgressLeftNum(danmakuSize, 50, 170)}%`}">
                                                            <div class="setting-size-empty"></div>
                                                            <div class="setting-size-fill"></div>
                                                            <input 
                                                                class="danmaku-setting-slider"
                                                                v-model="danmakuSize"
                                                                type="range" 
                                                                max="170" 
                                                                min="50"
                                                                step="1"
                                                            >
                                                        </div>
                                                    <span class="text-[12px] ml-10 progress-val">{{ danmakuSize }}%</span>
                                                </div>
                                            </div>
                                        </transition>
                                    </div>
                                </div>
                                <!-- 音量 -->
                                <div class="player-ctrl-volume player-ctrl-btn player-control-hover" @mouseover="handleVolumesMouseOver" @mouseleave="handleVolumesMouseLeave">
                                    <transition name="opacity-fade">
                                        <div class="player-ctrl-volume-box flex-column" :style="{'--volume': `${curVideoVolume}%`}" v-if="isShowVolume">
                                            <div class="player-ctrl-volume-box-area">
                                                <div class="player-ctrl-volume-box-wrap">
                                                    <div class="volume-empty"></div>
                                                    <div class="volume-fill"></div>
                                                    <input type="range" class="volume-slider"  min="0" max="100" step="1" v-model="curVideoVolume" @input="handleChangeVolume">
                                                </div>
                                            </div>
                                            <div class="player-ctrl-volume-number">
                                                <span>{{ curVideoVolume }}%</span>
                                            </div>
                                        </div>
                                    </transition>
  
                                    <div class="player-ctrl-common-svg">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88" width="88" height="88" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
                                            <defs>
                                                <clipPath id="__lottie_element_60">
                                                    <rect width="88" height="88" x="0" y="0"></rect>
                                                </clipPath>
                                                <clipPath id="__lottie_element_62">
                                                    <path d="M0,0 L88,0 L88,88 L0,88z"></path>
                                                </clipPath>
                                            </defs>
                                            <g clip-path="url(#__lottie_element_60)">
                                                <g clip-path="url(#__lottie_element_62)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;">
                                                    <g transform="matrix(1,0,0,1,28,44)" opacity="1" style="display: block;">
                                                        <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                            <path fill="rgb(255,255,255)" fill-opacity="1" d=" M15.5600004196167,-25.089000701904297 C15.850000381469727,-24.729000091552734 16,-24.288999557495117 16,-23.839000701904297 C16,-23.839000701904297 
                                                            16,23.840999603271484 16,23.840999603271484 C16,24.94099998474121 15.100000381469727,25.840999603271484 14,25.840999603271484 C13.550000190734863,25.840999603271484 13.109999656677246,25.680999755859375 
                                                            12.75,25.400999069213867 C12.75,25.400999069213867 -4,12.00100040435791 -4,12.00100040435791 C-4,12.00100040435791 -8,12.00100040435791 -8,12.00100040435791 C-12.420000076293945,12.00100040435791 
                                                            -16,8.420999526977539 -16,4.000999927520752 C-16,4.000999927520752 -16,-3.999000072479248 -16,-3.999000072479248 C-16,-8.418999671936035 -12.420000076293945,-11.99899959564209 -8,-11.99899959564209 
                                                            C-8,-11.99899959564209 -4,-11.99899959564209 -4,-11.99899959564209 C-4,-11.99899959564209 12.75,-25.39900016784668 12.75,-25.39900016784668 C13.609999656677246,-26.089000701904297 14.869999885559082,
                                                            -25.948999404907227 15.5600004196167,-25.089000701904297z">
                                                            </path>
                                                        </g>
                                                    </g>
                                                    <g style="display: none;" transform="matrix(1.0074011087417603,0,0,1.0074011087417603,56.02903747558594,44.00049591064453)" opacity="0.01692792263200147">
                                                        <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                            <path fill="rgb(255,255,255)" fill-opacity="1" d=" M-4,-13.859000205993652 C0.7799999713897705,-11.08899974822998 4,-5.919000148773193 4,0.0010000000474974513 C4,5.921000003814697 0.7799999713897705,
                                                            11.090999603271484 -4,13.861000061035156 C-4,13.861000061035156 -4,-13.859000205993652 -4,-13.859000205993652z">
                                                            </path>
                                                        </g>
                                                    </g>
                                                    <g style="display: none;" transform="matrix(1.0126574039459229,0,0,1.0126574039459229,64.37825012207031,44.0057487487793)" opacity="0.0028306050683978867">
                                                        <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                            <path fill="rgb(255,255,255)" fill-opacity="1" d=" M-6.236000061035156,-28.895999908447266 C4.803999900817871,-23.615999221801758 11.984000205993652,-12.456000328063965 11.984000205993652,
                                                            -0.006000000052154064 C11.984000205993652,12.454000473022461 4.794000148773193,23.624000549316406 -6.265999794006348,28.893999099731445 C-8.255999565124512,29.8439998626709 -10.645999908447266,
                                                            29.003999710083008 -11.595999717712402,27.003999710083008 C-12.545999526977539,25.013999938964844 -11.696000099182129,22.624000549316406 -9.706000328063965,21.673999786376953 C-1.406000018119812,
                                                            17.724000930786133 3.9839999675750732,9.343999862670898 3.9839999675750732,-0.006000000052154064 C3.9839999675750732,-9.345999717712402 -1.3960000276565552,-17.715999603271484 -9.675999641418457,
                                                            -21.676000595092773 C-11.675999641418457,-22.625999450683594 -12.515999794006348,-25.016000747680664 -11.565999984741211,-27.006000518798828 C-10.616000175476074,-29.006000518798828 -8.22599983215332,
                                                            -29.84600067138672 -6.236000061035156,-28.895999908447266z">
                                                            </path>
                                                        </g>
                                                    </g>
                                                    <g style="display: none;" transform="matrix(1.0002120733261108,0,0,1.0002120733261108,56.00299072265625,44)" opacity="0.9999997280440319">
                                                        <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                            <path fill="rgb(255,255,255)" fill-opacity="1" d=" M-4,-13.859000205993652 C0.7799999713897705,-11.08899974822998 4,-5.919000148773193 4,0.0010000000474974513 C4,5.921000003814697 0.7799999713897705,
                                                            11.090999603271484 -4,13.861000061035156 C-4,13.861000061035156 -4,-13.859000205993652 -4,-13.859000205993652z">
                                                            </path>
                                                        </g>
                                                    </g>
                                                    <g style="display: none;" transform="matrix(1.0002062320709229,0,0,1.0002062320709229,64.00399780273438,44.00699996948242)" opacity="1">
                                                        <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                            <path fill="rgb(255,255,255)" fill-opacity="1" d=" M-6.236000061035156,-28.895999908447266 C4.803999900817871,-23.615999221801758 11.984000205993652,-12.456000328063965 11.984000205993652,-0.006000000052154064 
                                                            C11.984000205993652,12.454000473022461 4.794000148773193,23.624000549316406 -6.265999794006348,28.893999099731445 C-8.255999565124512,29.8439998626709 -10.645999908447266,29.003999710083008 
                                                            -11.595999717712402,27.003999710083008 C-12.545999526977539,25.013999938964844 -11.696000099182129,22.624000549316406 -9.706000328063965,21.673999786376953 C-1.406000018119812,17.724000930786133 
                                                            3.9839999675750732,9.343999862670898 3.9839999675750732,-0.006000000052154064 C3.9839999675750732,-9.345999717712402 -1.3960000276565552,-17.715999603271484 -9.675999641418457,-21.676000595092773 
                                                            C-11.675999641418457,-22.625999450683594 -12.515999794006348,-25.016000747680664 -11.565999984741211,-27.006000518798828 C-10.616000175476074,-29.006000518798828 -8.22599983215332,-29.84600067138672 
                                                            -6.236000061035156,-28.895999908447266z">
                                                            </path>
                                                        </g>
                                                    </g>
                                                    <g transform="matrix(1,0,0,1,56,44)" opacity="1" style="display: block;">
                                                        <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                            <path fill="rgb(255,255,255)" fill-opacity="1" d=" M-4,-13.859000205993652 C0.7799999713897705,-11.08899974822998 4,-5.919000148773193 4,0.0010000000474974513 C4,5.921000003814697 0.7799999713897705,
                                                            11.090999603271484 -4,13.861000061035156 C-4,13.861000061035156 -4,-13.859000205993652 -4,-13.859000205993652z">
                                                            </path>
                                                        </g>
                                                    </g>
                                                    <g transform="matrix(1,0,0,1,64.01399993896484,44.00699996948242)" opacity="1" style="display: block;">
                                                        <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                                                            <path fill="rgb(255,255,255)" fill-opacity="1" d=" M-6.236000061035156,-28.895999908447266 C4.803999900817871,-23.615999221801758 11.984000205993652,-12.456000328063965 11.984000205993652,-0.006000000052154064
                                                            C11.984000205993652,12.454000473022461 4.794000148773193,23.624000549316406 -6.265999794006348,28.893999099731445 C-8.255999565124512,29.8439998626709 -10.645999908447266,29.003999710083008 
                                                            -11.595999717712402,27.003999710083008 C-12.545999526977539,25.013999938964844 -11.696000099182129,22.624000549316406 -9.706000328063965,21.673999786376953 C-1.406000018119812,17.724000930786133 
                                                            3.9839999675750732,9.343999862670898 3.9839999675750732,-0.006000000052154064 C3.9839999675750732,-9.345999717712402 -1.3960000276565552,-17.715999603271484 -9.675999641418457,-21.676000595092773 
                                                            C-11.675999641418457,-22.625999450683594 -12.515999794006348,-25.016000747680664 -11.565999984741211,-27.006000518798828 C-10.616000175476074,-29.006000518798828 -8.22599983215332,-29.84600067138672 
                                                            -6.236000061035156,-28.895999908447266z">
                                                            </path>
                                                        </g>
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
                <!-- 隐藏简介按钮 -->
                <div 
                    class="player-hide-introduce-btn flex-center" 
                    :style="isShowIntroduce ? 'transform: translateY(-50%);  border-radius: 5px 0 0 5px; ' : 'transform: translateY(-50%) rotate(180deg); border-radius: 0 5px 5px 0;'" 
                    v-show="isMouseMoving" 
                    @click.capture="handleClickHideIntroduceBtn"
                >
                    <component :is="rightIcon" class="img"></component>
                </div>
            </div>
            <div class="player-live-danmuku">
                <Danmaku 
                    ref="danmakuRef"
                    @clearDanmakuScrollList="clearDanmakuScrollList"
                    :danmakuScrollList="danmakuScrollList"
                    :danmakuSetting="danmakuSettingData"
                    :positionTrigger="isShowIntroduce"
                >
                </Danmaku>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ComputedRef, ref, Ref, inject, watch, onMounted, onUnmounted, nextTick } from 'vue';
    import { useStore } from 'vuex';
    import Hls from 'hls.js';
    import * as R from 'ramda';
    import debounce from '@/utils/common/debounce';
    import { getLiveStreamUrl, getLiveRoomInfo, getLiveAnchorInfo } from '@/api/home/live';
    import Danmaku from '../Danmaku/index.vue';
    import rightIcon from '@/assets/icon/common/right.svg';
    import onlineIcon from '@/assets/icon/common/online.svg';
    import likeIcon from '@/assets/icon/common/like.svg';

    interface DanmakuElement extends HTMLElement {
        resetCurIndex: (curPlayerTime: number) => void,
        closeDanmaku: () => void,
        openDanmaku: () => void,
    }
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
    interface QualityOptionItem {
        qn: number,
        desc: string,
        hdr_type: number
    }
    
    interface RoomInfo {
        area_name: string,
        background: string,
        description: string,
        title: string,
        parent_area_name: string,
    }

    interface AnchorInfo {
        info: {
            uid: number,
            uname: string,
            face: string,
        }
    }

    const props = defineProps(['danmakuScrollList', 'roomMsg']);
    const emit = defineEmits(['clearDanmakuScrollList', 'updatePanelState']);
    const store = useStore();
    const sessdata = store.state.userModule.sessdata || '';
    const roomMsg: ComputedRef<{ watcherCount?: string, likeCount?: number }> = computed(() => props.roomMsg);
    const danmakuScrollList: ComputedRef<DanmakuItem[]> = computed(() => props.danmakuScrollList);
    const clearDanmakuScrollList = (list: DanmakuItem[], index: number) => emit('clearDanmakuScrollList', list, index);
    let playerRef = ref<HTMLMediaElement | null>(null);
    let playerControlRef = ref<HTMLElement | null>(null);
    const liveInfo: Ref<{ roomid?: number } | null> = inject('liveInfo', ref(null));
    let liveInfoWatcher = null;
    liveInfoWatcher = watch(liveInfo, async (newVal) => {
        if(newVal && newVal.roomid && playerRef.value) {
            await nextTick();
            playLive(newVal.roomid);
            fetchLiveRoomInfo(newVal.roomid);
            fetchLiveAnchorInfo(newVal.roomid);
        };
    }, { once: true });

    let liveRoomInfo = ref<RoomInfo | null>(null);
    const fetchLiveRoomInfo = async(roomid: number | string): Promise<void> => {
        try {
            const response = await getLiveRoomInfo({ room_id: roomid });
            const successAction = R.pipe(
                R.pathOr(null, ['data']),
                R.tap((data: RoomInfo | null) => liveRoomInfo.value = data),
            );
            const failAction = R.pipe(
                R.pathOr('', ['message']),
                R.when(
                    (message: string) => message !== '' && message !== 'undefined',
                    (message: string) => {
                        ElMessage.error(message);
                        throw new Error(message);
                    },
                ),
                () => liveRoomInfo.value = null,
            );
            
            R.ifElse(
                R.propEq(0, 'code'),
                successAction, 
                failAction
            )(R.path(['data'], response));
        } catch(err) {
            console.log('获取直播间信息失败', err);
        };
    };
    let liveAnchorInfo = ref<AnchorInfo | null>(null);
    const fetchLiveAnchorInfo = async(roomid: number | string) => {
        try {
            const response = await getLiveAnchorInfo({ roomid });
            const successAction = R.pipe(
                R.pathOr(null, ['data']),
                R.tap((data: AnchorInfo | null) => {
                    liveAnchorInfo.value = data;
                }),
            );
            const failAction = R.pipe(
                R.pathOr('', ['message']),
                R.when(
                    (message: string) => message !== '' && message !== 'undefined',
                    (message: string) => {
                        ElMessage.error(message);
                        throw new Error(message);
                    },
                ),
                () => liveAnchorInfo.value = null,
            );
            
            R.ifElse(
                R.propEq(0, 'code'),
                successAction,
                failAction
            )(R.path(['data'], response));
        } catch(err) {
            console.log('获取主播信息失败', err);
        };
    };

    let isMouseMoving = ref(false);
    const updateIsMouseMovingState = (isMoving: boolean) => {
        isMouseMoving.value = isMoving;
    };
    const hideBottomArea = () => {
        updateIsMouseMovingState(false);
        hideControlPopupBar();
    };
    const hideBottomAreaDelay = debounce(hideBottomArea, 1000);
    const cancelHideBottomAreaDelay = hideBottomAreaDelay.cancel;
    const handleControlMouseMove = () => {
        updateIsMouseMovingState(true);
        hideBottomAreaDelay();
    };
    const handleControlMouseLeave = () => {
        hideBottomArea();
        hideControlPopupBar();
    };
    const handleControlBottomMouseMove = (event: Event) => {
        event.stopPropagation();
        updateIsMouseMovingState(true);
        cancelHideBottomAreaDelay();
    };

    // **播放器操作模块
    
    // 清除所有弹出框
    const hideControlPopupBar = () => {
        updateShowVolumeState(false);
        updateShowQualityState(false);
        updateShowSettingState(false);
    };

    // 键盘操作事件
    const keydownActions = [
        {key: ' ', action: () => {
            updatePlayState(!isPlaying.value);
        }},
        {key: 'ArrowUp', action: async () => {
            curVideoVolume.value = Math.min(100, curVideoVolume.value + 5);
            await updatePlayerVolume(curVideoVolume.value);
        }},
        {key: 'ArrowDown', action: async () => {
            curVideoVolume.value = Math.max(0, curVideoVolume.value - 5);
            await updatePlayerVolume(curVideoVolume.value);
        }},
    ];

    const handleWindowKeyDown = async (event: KeyboardEvent ) => {
        event.preventDefault();
        const key = event.key;
        const action = R.pipe(
            R.find((item: {key: string, action: () => void}) => item['key'] === key),
            R.propOr(null, 'action') as (data: any) => () => void
        )(keydownActions);
        if(action) {
            await action();
        };
    };
        // 控制视频播放与暂停
    let isPlaying = ref(true);
    const updatePlayState = async (playingState: boolean) => {
        isPlaying.value = playingState;
        if(isPlaying.value) {
            playerRef.value?.play();
        }
        else {
            playerRef.value?.pause();
        };
    };

    const handleClickCtrlBtn = () => {
        if(!isPlaying.value) {
            updatePlayState(true);
        } 
        else {
            updatePlayState(false);
        };
    };

    const curVideoVolume = ref(50);
    const updatePlayerVolume = async (volume: string | number) => {
        try {
            let volumeNum = Number(volume);
            if(volumeNum > 100) {
                volumeNum = 100;
            }
            else if(volumeNum < 0) {
                volumeNum = 0;
            };
            await nextTick();
            if(!playerRef.value) {
                return;
            };
            if('volume' in playerRef.value && playerRef.value.volume === volumeNum / 100) {
                return;
            };
            playerRef.value.volume = volumeNum / 100;
        } catch(err) {
            console.log('音量修改失败', err);
        };
    };
    const handleChangeVolume = async () => {
        await updatePlayerVolume(curVideoVolume.value);
    };

    // 控制音量显示
    let isShowVolume = ref(false);
    let hideVolumeTimer: ReturnType<typeof setTimeout> | null = null;
    const updateShowVolumeState = (volumeState: boolean) => {
        if(volumeState && hideVolumeTimer) {
            clearTimeout(hideVolumeTimer);
            hideVolumeTimer = null;
        };
        isShowVolume.value = volumeState;
    };
    const handleVolumesMouseOver = () => {
        hideControlPopupBar();
        updateShowVolumeState(true);
    };
    const handleVolumesMouseLeave = () => {
        hideVolumeTimer = setTimeout(() => {
            updateShowVolumeState(false);
        }, 200);
    };

    // 控制清晰度
    let isShowQuality = ref(false);
    let curQuality = ref<number>(-1);
    const allqualityOptional = ref<QualityOptionItem[]>([]);
    const qualityOptional = ref<QualityOptionItem[]>([]);
    const updateShowQualityState = (qualityState: boolean) => {
        isShowQuality.value = qualityState;
    };
    const updateCurQuality = (qualityId: number) => {
        curQuality.value = qualityId;
    };
    const curQualityValue = computed(() => {
        const quality  = R.find(R.propEq(curQuality.value, 'qn'))(qualityOptional.value) as QualityOptionItem | undefined;
        return quality ? quality.desc : '';
    });

  
    let handleMouseLeaveQulityDebounce = null;
    handleMouseLeaveQulityDebounce = debounce(() => {
        updateShowQualityState(false);
    }, 500);
    const handleMouseEnterQulity = () => {
        hideControlPopupBar();
        updateShowQualityState(true);
        if(handleMouseLeaveQulityDebounce) {
            handleMouseLeaveQulityDebounce.cancel();
        };
    };
    const handleQualityMenuItemClick = async (quailtyId: number) => {
        if(quailtyId === curQuality.value) {
            return;
        };
        updatePlayState(false);
        updateCurQuality(quailtyId);
        updateShowQualityState(false);
        await playLive(liveInfo.value?.roomid || 0, quailtyId);
    };

    let isShowIntroduce = ref(true);
    const updateIntroduceState = (state: boolean) => {
        isShowIntroduce.value = state;
    };
    const handleClickHideIntroduceBtn = (event: Event)  => {
        event.stopPropagation();
        updateIntroduceState(!isShowIntroduce.value);
        emit('updatePanelState', isShowIntroduce.value);
    };


    // 弹幕设置
    // 显示区域
    let danmakuShowArea = ref(25);
    let realDanmakuShowArea = computed(() => Number(danmakuShowArea.value) > 10 ? danmakuShowArea.value : 10);
    let danmakuOpacity = ref(70);
    let danmakuSize = ref(80);
    let danmakuSpeed = ref(25);
    let danmakuSettingData = computed(() => ref({
        danmakuShowArea: Number(realDanmakuShowArea.value),
        danmakuOpacity: Number(danmakuOpacity.value),
        danmakuSize: Number(danmakuSize.value),
        danmakuSpeed: Number(danmakuSpeed.value)
    }));

    const danmakuRef = ref<DanmakuElement | null>(null);
    let closeDanmaku: (() => void) | null = null;
    let openDanmaku: (() => void) | null = null;
    let isDanmakuClosed = ref(false);
    const updateDanmakuState = (danmakuState: boolean) => {
        isDanmakuClosed.value = danmakuState;
    };
    const handleClickDanmakuSwitchBtn = () => {
        if(isDanmakuClosed.value && openDanmaku) {
            openDanmaku();
        }
        else if(closeDanmaku) {
            closeDanmaku();
        };
        updateDanmakuState(!isDanmakuClosed.value);
    };

    const getProgressLeftNum = (value: number, min: number, max: number): number => (value - min) / (max - min) * 100;

    let isShowSetting = ref(false);
    const updateShowSettingState = (settingState: boolean) => {
        isShowSetting.value = settingState;
    };
    let handleMouseLeaveDanmakuSettingDebounce = null;
    handleMouseLeaveDanmakuSettingDebounce = debounce(() => {
        updateShowSettingState(false);
    }, 500);
    const handleMouseEnterDanmakuSetting = () => {
        hideControlPopupBar();
        updateShowSettingState(true);
        if(handleMouseLeaveDanmakuSettingDebounce) {
            handleMouseLeaveDanmakuSettingDebounce.cancel();
        };
    };
    let hls: Hls | null = null;
    // 获取直播流地址
    const fetchLiveStreamUrl = async (roomid: number, sessdata: string, qn: number): Promise<string> => {
        try {
            const response = await getLiveStreamUrl({
                room_id: roomid, 
                protocol: '0,1', 
                format: '0,1,2', 
                codec: '0,1,2',
                qn,
                platform: 'web',
                ptype: 8,
                dolby: 5,
                panorama: 1,
                hdr_type: '0,1',
                req_reason: 0,
            }, sessdata);
            const successAction = R.pipe(
                R.pathOr<any>('', ['data', 'playurl_info', 'playurl']),
                R.tap(playurl => allqualityOptional.value = playurl.g_qn_desc),
                R.pathOr<any>('', ['stream']),
                R.find(R.propEq('http_hls', 'protocol_name')),
                R.pathOr('', ['format']) as (data: any) => any,
                R.find(R.propEq('ts', 'format_name')),
                R.pathOr('', ['codec']) as (data: any) => any,
                R.find(R.propEq('avc', 'codec_name')),
                ((item: any) => {
                    if(item) {
                        qualityOptional.value = R.filter<QualityOptionItem>(qualityOption => R.includes(qualityOption.qn, item.accept_qn) && R.propEq(item.hdr_type, 'hdr_type')(qualityOption))(allqualityOptional.value);
                        updateCurQuality(item.current_qn);
                        return item.url_info[0].host + item.base_url + item.url_info[0].extra;
                    }
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
        };
    };
    const playLive = debounce(async (roomid: number, qn: number = 0) => {
        const streamUrl = await fetchLiveStreamUrl(roomid, sessdata, qn);
        if (playerRef.value) {
            hls = new Hls();
            // 加载直播流
            hls.loadSource(streamUrl);
            // 将 hls.js 绑定到 video 元素
            hls.attachMedia(playerRef.value);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                updatePlayState(true);
            });
            hls.on(Hls.Events.ERROR, function (_event, data) {
                console.error('HLS加载错误:', data);
            });
        };
    });

    onMounted(async () => {
        updatePlayerVolume(curVideoVolume.value);
        if(danmakuRef.value) {
            closeDanmaku = danmakuRef.value.closeDanmaku;
            openDanmaku = danmakuRef.value.openDanmaku;
        };
    });
    onUnmounted(() => {
        // 清理
        if(playerControlRef.value) {
            playerControlRef.value.removeEventListener('mousemove', handleControlMouseMove);
            playerControlRef.value.removeEventListener('mouseleave', handleControlMouseLeave);
        };
        window.removeEventListener('keydown', handleWindowKeyDown);
        liveInfoWatcher();
    });
</script>

<style lang="scss" scoped>
    $sideDistance: 12px;
    $processBarHeight: 4px;
    $processBarAreaHeight: 16px;
    ul {
        list-style-type: none;
        outline: none;
        padding: 0;
        margin: 0;
    }
    li {
        margin: 0;
        padding: 0;
    }
    .player-content {
        width: 100%;
        height: 100%;
        background-color: #000;
        .header-info {
            height: 100px;
            width: 100%;
            border: #2f3134 1px solid;
            box-sizing: border-box;
            padding: 10px;
            color: #fff;
            background-color: #1e2022;
            overflow: hidden;
            .left {
                height: 68px;
                .text {
                    padding: 10px 0;
                    height: 100%;
                    box-sizing: border-box;
                }
            }
            .right {
                height: 100%;
                box-sizing: border-box;
            }
            .text-hover-color {
                cursor: pointer;
                transition: .3s;
                &:hover{
                    color: #E9CD2F;
                }
            }
        }
        .player-live-area {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            .player-live-wrap {
                height: 100%;
                width: 100%;
                video {
                    max-width: 100%;
                    max-height: 100%;
                    background-color: #000;
                    object-fit: contain;
                    overflow-clip-margin: content-box;
                    overflow: clip;
                }
            }
            .player-live-control {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                z-index: 2;
                .player-control-fade-enter-active, .player-control-fade-leave-active {
                    transition: opacity 0.7s;
                }
                .player-control-fade-enter-from, .player-control-fade-leave-to {
                    opacity: 0;
                }
                .player-control-fade-enter-to, .player-control-fade-leave-from {
                    opacity: 1;
                }

                .player-control-fade-start-enter-active {
                    transition: opacity 0.7s;
                }
                .player-control-fade-start-enter-from, .player-control-fade-start-leave-to {
                    opacity: 0;
                }
                .player-control-fade-start-enter-to, .player-control-fade-start-leave-from {
                    opacity: 1;
                }
                // 父元素层级影响子元素的层级
                .player-control-wrap {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    transition: .2s;
                    z-index: 2;
                    .player-control-mask {
                        bottom: 0;
                        height: 100px;
                        left: 0;
                        pointer-events: none;
                        position: absolute;
                        -webkit-transition: opacity .2s ease-in-out;
                        transition: opacity .2s ease-in-out;
                        width: 100%;
                        z-index: -1;
                        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==") repeat-x bottom;
                    }
                    .player-control-bottom {
                        display: flex;
                        height: 35px;
                        justify-content: space-between;
                        line-height: 22px;
                        margin: 20px 0 $processBarHeight;
                        transition: all .2s ease-out;
                        width: 100%;
                        padding: 0 $sideDistance;
                        box-sizing: border-box;
                        .player-ctrl-btn {
                            position: relative;
                            fill: #fff;
                            color: hsla(0, 0%, 100%, .8);
                            height: 22px;
                            width: 36px;
                            padding: 2px 3px;
                            line-height: 22px;
                            outline: 0;
                            text-align: center;
                            cursor: pointer;
                            transition: .3s;
                            .player-ctrl-common-svg {
                                opacity: .9;
                                user-select: none;
                                cursor: pointer;
                                width: 100%;
                                height: 100%;
                                svg {
                                    width: 100%;
                                    height: 100%;
                                    transition: fill .15s ease-in-out;
                                }
                            }
                        }
                        .player-control-bottom-left {
                            .player-ctrl-time {
                                color: #fff;
                                min-width: 100px;
                                .player-ctrl-time-label {
                                    min-width: 40px;
                                }
                            }
                        }
                        .player-control-bottom-right {
                            .player-ctrl-quality {
                                position: relative;
                                font-size: 12px;
                                .player-ctrl-quality-menu {
                                    position: absolute;
                                    left: 50%;
                                    bottom: 50px;
                                    transform: translateX(-50%);
                                    background: hsla(0, 0%, 8%, .9);
                                    border-radius: 2px;
                                    overflow: hidden;
                                    padding: 5px;
                                    .player-ctrl-quality-item {
                                        position: relative;
                                        height: 36px;
                                        line-height: 36px;
                                        white-space: nowrap;
                                        padding: 0 12px;
                                        cursor: pointer;
                                        &:hover {
                                            background-color: hsla(0, 0%, 100%, .1);
                                            border-radius: 5px;
                                        }
                                    }
                                    .player-ctrl-quality-item-active {
                                        color: var(--brand-pink, #FF6699);
                                    }
                                }
                                .player-ctrl-quality-result {
                                    cursor: pointer;
                                    width: 100%;
                                }
                            }
                            .player-danmaku-area {
                                fill: #fff;
                                height: 22px;
                                .player-danmaku-switch {
                                    width: 36px;
                                    padding: 2px 3px;
                                    height: 100%;
                                    cursor: pointer;
                                    svg {
                                        width: 100%;
                                        height: 100%;
                                    }
                                }
                                .player-danmaku-setting {
                                    position: relative;
                                    width: 36px;
                                    padding: 2px 3px;
                                    height: 100%;
                                    cursor: pointer;
                                    svg {
                                        width: 100%;
                                        height: 100%;
                                    }
                                    .setting-wrap {
                                        display: flex;
                                        flex-direction: column;
                                        justify-content: flex-end;
                                        position: absolute;
                                        top: -10px;
                                        left: 100%;
                                        transform: translateX(-100%) translateY(-100%);
                                        padding: 10px 15px;
                                        width: 270px;
                                        background: rgba(44, 44, 44, 0.8);
                                        z-index: 4;
                                        color: #fff;
                                        .setting-show-wrap {
                                            display: flex;
                                            align-items: center;
                                            .setting-show-area {
                                                position: relative;
                                                height: 100%;
                                                flex: 1;
                                                height: 5px;
                                                .setting-show-empty {
                                                    position: absolute;
                                                    left: var(--showArea, 25%);
                                                    top: 0;
                                                    height: 100%;
                                                    background-color: #474747;
                                                    width: calc(100% - var(--showArea, 75%));
                                                    z-index: 1;
                                                    border-radius: 5px;
                                                }
                                                .setting-show-fill {
                                                    position: absolute;
                                                    left: 0;
                                                    bottom: 0;
                                                    height: 100%;
                                                    background-color: var(--brand-pink, #FF6699);
                                                    width: var(--showArea, 25%);
                                                    z-index: 1;
                                                    border-radius: 5px;
                                                }
                                            }
                                        }
                                        .setting-opacity-wrap {
                                            display: flex;
                                            align-items: center;
                                            .setting-opacity-area {
                                                position: relative;
                                                height: 100%;
                                                flex: 1;
                                                height: 5px;
                                                .setting-opacity-empty {
                                                    position: absolute;
                                                    left: var(--opacity, 25%);
                                                    top: 0;
                                                    height: 100%;
                                                    background-color: #474747;
                                                    width: calc(100% - var(--opacity, 75%));
                                                    z-index: 1;
                                                    border-radius: 5px;
                                                }
                                                .setting-opacity-fill {
                                                    position: absolute;
                                                    left: 0;
                                                    bottom: 0;
                                                    height: 100%;
                                                    background-color: var(--brand-pink, #FF6699);
                                                    width: var(--opacity, 25%);
                                                    z-index: 1;
                                                    border-radius: 5px;
                                                }
                                            }
                                        }
                                        .setting-size-wrap {
                                            display: flex;
                                            align-items: center;
                                            .setting-size-area {
                                                position: relative;
                                                height: 100%;
                                                flex: 1;
                                                height: 5px;
                                                .setting-size-empty {
                                                    position: absolute;
                                                    left: var(--size, 25%);
                                                    top: 0;
                                                    height: 100%;
                                                    background-color: #474747;
                                                    width: calc(100% - var(--size, 75%));
                                                    z-index: 1;
                                                    border-radius: 5px;
                                                }
                                                .setting-size-fill {
                                                    position: absolute;
                                                    left: 0;
                                                    bottom: 0;
                                                    height: 100%;
                                                    background-color: var(--brand-pink, #FF6699);
                                                    width: var(--size, 25%);
                                                    z-index: 1;
                                                    border-radius: 5px;
                                                }
                                            }
                                        }
                                        .setting-speed-wrap {
                                            display: flex;
                                            align-items: center;
                                            .setting-speed-area {
                                                position: relative;
                                                height: 100%;
                                                flex: 1;
                                                height: 5px;
                                                .setting-speed-empty {
                                                    position: absolute;
                                                    left: var(--speed, 25%);
                                                    top: 0;
                                                    height: 100%;
                                                    background-color: #474747;
                                                    width: calc(100% - var(--speed, 25%));
                                                    z-index: 1;
                                                    border-radius: 5px;
                                                }
                                                .setting-speed-fill {
                                                    position: absolute;
                                                    left: 0;
                                                    bottom: 0;
                                                    height: 100%;
                                                    background-color: var(--brand-pink, #FF6699);
                                                    width: var(--speed, 75%);
                                                    z-index: 1;
                                                    border-radius: 5px;
                                                }
                                            }
                                        }
                                        .progress-val {
                                            width: 30px;
                                        }
                                        .danmaku-setting-slider {
                                            appearance: none;
                                            position: absolute;
                                            left: 50%;
                                            bottom: 50%;
                                            width: 100%;
                                            height: 100%;
                                            transform: translateX(-50%) translateY(50%);
                                            transform-origin: 50% 50%;
                                            outline: none;
                                            background-color: transparent;
                                            border-radius: 5px;
                                            z-index: 2;
                                            &::-webkit-slider-thumb {
                                                appearance: none;
                                                width: 15px;
                                                height: 15px;
                                                border-radius: 50%;
                                                background-color: #fff;
                                                cursor: pointer;
                                            }
                                        }
                                        .danmaku-setting-step {
                                            background-image: radial-gradient(circle, #fff 0%, #fff 7%, transparent 0%);
                                            background-size: 25%; /* 每25%的宽度出现一个圆点 */
                                            background-position: -15% 0;
                                            background-repeat: repeat-x; /* 水平方向重复 */
                                        }
                                    }
                                }
                            }
                            .player-ctrl-volume {
                                position: relative;
                                .player-ctrl-volume-box {
                                    position: absolute;
                                    left: 50%;
                                    bottom: 50px;
                                    transform: translateX(-50%);
                                    height: 120px;
                                    width: 42px;
                                    background: hsla(0, 0%, 8%, .9);
                                    border-radius: 2px;
                                    .player-ctrl-volume-box-area {
                                        position: relative;
                                        width: 100%;
                                        height: 100%;
                                        .player-ctrl-volume-box-wrap {
                                            position: absolute;
                                            left: 50%;
                                            bottom: 50%;
                                            transform: translateX(-50%) translateY(50%);
                                            width: 2px;
                                            height: 80px;
                                            .volume-slider {
                                                appearance: none;
                                                position: absolute;
                                                left: 50%;
                                                bottom: 50%;
                                                width: 80px;
                                                height: 2px;
                                                transform: translateX(-50%) translateY(50%) rotate(-90deg);
                                                transform-origin: 50% 50%;
                                                outline: none;
                                                background-color: transparent;
                                                z-index: 2;
                                                border-radius: 5px;
                                                // 滑块样式
                                                &::-webkit-slider-thumb {
                                                    appearance: none;
                                                    width: 12px;
                                                    height: 12px;
                                                    border-radius: 50%;
                                                    background-color: var(--brand-pink, #FF6699);
                                                    cursor: pointer;
                                                }
                                            }
                                            .volume-fill {
                                                position: absolute;
                                                left: 0;
                                                bottom: 0;
                                                width: 100%;
                                                background-color: var(--brand-pink, #FF6699);
                                                height: var(--volume, 50%);
                                                z-index: 1;
                                                border-radius: 5px;
                                            }
                                            .volume-empty {
                                                position: absolute;
                                                left: 0;
                                                top: 0;
                                                width: 100%;
                                                background-color: #e7e7e7;
                                                height: calc(100% - var(--volume, 50%));
                                                z-index: 1;
                                                border-radius: 5px;
                                            }
                                        }
                                    }
                                    .player-ctrl-volume-number {
                                        text-align: center;
                                        color: #e5e9ef;
                                        font-size: 12px;
                                        height: 28px;
                                        line-height: 28px;
                                        margin-bottom: 2px;
                                        width: 100%;
                                    }
                                }
                            }
                        }
                        .player-control-hover {
                            &:hover {
                                background-color: rgba(109, 91, 99, .7);
                                border-radius: 5px;
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
                .player-hide-introduce-btn {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    cursor: pointer;
                    width: 30px;
                    height: 50px;
                    background-color: hsla(0, 0%, 8%, .5);
                    z-index: 2;
                    &:hover {
                        background-color: hsla(0, 0%, 8%, .8);
                    }
                    .img {
                        width: 20px;
                        height: 20px;
                    }
                }
            }
            .player-live-danmuku {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                z-index: 1;
            }
        }
    }
</style>