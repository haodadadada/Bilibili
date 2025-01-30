export default{
    namespaced: true,
    state: {
        userInfo: {},
        isLogin: false,
        isLight: true,
        sessdata: '',
        wbi_key: {
            img_key: '',
            sub_key: ''
        }
    },
    getters: {

    },
    mutations: {
        changeUserInfo(state, value) {
            state.userInfo = {
              ...state.userInfo,
              ...value
            };
        },
        clearUserInfo(state) {
            state.userInfo = {};
        },
        changeUserLoginState(state, value) {
            state.isLogin = value;
        },
        changeUserLight(state, value) {
            state.isLight = value;
        },
        updateSessdata(state, value) {
            state.sessdata = value;
        },
        clearSessdata(state) {
            state.sessdata = '';
        },
        updateWbiKey(state, value) {
            const { img_key, sub_key } = value;
            state.wbi_key.img_key = img_key;
            state.wbi_key.sub_key = sub_key;
        },
        clearWbiKey(state) {
            state.wbi_key.img_key = '';
            state.wbi_key.sub_key = '';
        }
    }
};
  