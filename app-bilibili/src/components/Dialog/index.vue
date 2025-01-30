<template>
    <div>
        <div class="content">
            <slot></slot>
        </div>
        <div class="cover"></div>
    </div>

</template>

<style lang="scss" scoped>
    .content {
        position: fixed;
        z-index: 999;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        width: 300px;
        height: 230px;
        box-sizing: border-box;
        padding: 15px;
        background-color: var(--dialog-bg-color);
        border-radius: 10px;
        user-select: none;
        -webkit-user-select: none;
    }
    .cover {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); /* 半透明效果 */
        z-index: 998; /* 保证遮罩层覆盖所有内容 */
    }
</style>