interface UserInfo {
    current_level?: number;
    face?: string;
    mid?: number;
    uname?: string;
}
interface RootState {
    userInfo?: UserInfo;
    isLogin?: boolean;
    isLight?: boolean;
    sessdata?: string;
    wbi_key?: {
        img_key: string;
        sub_key: string;
    };
}
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
        changeUserInfo(state: RootState, value: any) {
            state.userInfo = {
              ...state.userInfo,
              ...value
            };
        },
        clearUserInfo(state: RootState) {
            state.userInfo = {};
        },
        changeUserLoginState(state: RootState, value: any) {
            state.isLogin = value;
        },
        changeUserLight(state: RootState, value: any) {
            state.isLight = value;
        },
        updateSessdata(state: RootState, value: any) {
            state.sessdata = value;
        },
        clearSessdata(state: RootState) {
            state.sessdata = '';
        },
        updateWbiKey(state: RootState, value: any) {
            const { img_key, sub_key } = value;
            if(state.wbi_key) {
                state.wbi_key.img_key = img_key;
            };
            if(state.wbi_key) {
                state.wbi_key.sub_key = sub_key;
            };
        },
        clearWbiKey(state: RootState) {
            if(state.wbi_key) {
                state.wbi_key.img_key = '';
            };
            if(state.wbi_key) {
                state.wbi_key.sub_key = '';
            };
        }
    }
};
  