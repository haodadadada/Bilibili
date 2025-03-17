import * as R from 'ramda';
export default R.curry((videoItem, videoRef: HTMLMediaElement | null, playVideo, curMouseIndex) => {
    curMouseIndex.value = -1;
    playVideo.cancel();

    if (videoRef) {
        videoRef.pause();
        videoRef.removeEventListener('timeupdate', videoItem.handleTimeUpdate);
    };
    videoItem.handleTimeUpdate = null;
});