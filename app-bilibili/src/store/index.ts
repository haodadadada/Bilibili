import { createStore } from 'vuex';
import createPersistedstate from 'vuex-persistedstate';
import userModule from './user';
import newsModule from './news';
export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    userModule,
    newsModule
  },
  plugins: [
    createPersistedstate({
    //key是存储数据的键名
      key: 'vuex',
    //paths是存储state中的那些数据，如果是模块下具体的数据需要加上模块名称，如user.token  
      paths: ['userModule.userInfo', 'userModule.isLogin', 'userModule.isLight', 'userModule.sessdata', 'userModule.wbi_key','newsModule.detailInfo']
    })
  ]
});
