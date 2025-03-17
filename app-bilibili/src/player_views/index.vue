<template>
    <div>
        <router-view v-slot="{ Component }">
            <component :is="Component"></component>
        </router-view>
    </div>
</template>

<script setup lang="ts">
    import { onUnmounted } from 'vue';
    import { useRouter } from 'vue-router';
    const router = useRouter();
    let removePlayerWindowIdLisenter: (() => void) | null = null;
    removePlayerWindowIdLisenter = window.electronAPI.receive('get_windowId', (windowId) => {
        if(windowId === 'video') {
            router.push('/video');
        }
        else if(windowId === 'live') {
            router.push('/live');
        };
    });
    onUnmounted(() => {
        if (removePlayerWindowIdLisenter) {
            (removePlayerWindowIdLisenter as () => void)();
        };
    });
</script>


<style lang="scss" scoped>

</style>