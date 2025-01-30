export default{
    namespaced: true,
    state: {
        detailInfo: {},
    },
    getters: {

    },
    mutations: {
        changeDetailInfo(state, value) {
            state.detailInfo = value;
        },
        clearDetailInfo(state) {
            state.detailInfo = {};
        },
    }
  };
  