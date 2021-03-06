import http from '@/common/request';
import _ from 'lodash';
const initState = {
  data: {
    list: [],
    pagination: {}
  },
  info: {
    id: '',
    scaffold_id: '',
    name: '',
    label: '',
    desc: '',
    template: '',
    htmlTemplate: '',
    jsTemplate: '',
    cssTemplate: ''
  }
};

export default {
  namespace: 'layout',
  state: _.cloneDeep(initState),

  effects: {
    *list({ payload, callback }, { call, put }) {
      const resData = yield call(http.layoutList, payload);

      if (resData.code === 200) {
        yield put({
          type: 'save',
          payload: resData.data
        });
      }

      if (callback) callback(resData);
    },
    *info({ payload, callback }, { call, put }) {
      yield put({
        type: 'reset',
        payload: {
          type: 'info'
        }
      });
      if (payload.id == 0) {
        return;
      }
      const resData = yield call(http.layoutInfo, payload);

      if (resData.code === 200) {
        yield put({
          type: 'saveInfo',
          payload: resData.data
        });
      }

      if (callback) callback(resData);
    },
    *add({ payload, callback }, { call, put }) {
      const resData = yield call(http.layoutAdd, payload, { method: 'post' });

      if (resData.code === 200) {
        yield put({
          type: 'save',
          payload: resData.data
        });
      }

      if (callback) callback(resData);
    },
    *remove({ payload, callback }, { call, put }) {
      const resData = yield call(http.layoutRemove, payload, {
        method: 'post'
      });

      if (resData.code === 200) {
        yield put({
          type: 'removeItems',
          payload: payload
        });
      }

      if (callback) callback(resData);
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    saveInfo(state, action) {
      return {
        ...state,
        info: action.payload
      };
    },
    removeItems(state, action) {
      const data = state.data;
      data.list = data.list.filter(item => action.payload.id.indexOf(item.id) === -1);
      return {
        ...state,
        data: data
      };
    },
    reset(state, action) {
      const type = action.type;
      if (type === 'list') {
        return {
          ...state,
          data: initState.data
        };
      } else if (type === 'info') {
        return {
          ...state,
          info: initState.info
        };
      } else {
        return {
          ...initState
        };
      }
    }
  }
};
