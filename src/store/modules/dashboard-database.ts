import { Commit, ActionTree, MutationTree, Dispatch } from 'vuex';
import { AxiosResponse } from 'axios';
import graph from '@/graph';
import * as types from '../mutation-types';

export interface State {
  databases: any;
  currentDatabase: any;
  databaseInfo: any;
}

const initState: State = {
  databases: [],
  currentDatabase: {},
  databaseInfo: {
    p50: [],
    p75: [],
    p90: [],
    p95: [],
    p99: [],
    getResponseTimeTrend: [],
    getSLATrend: [],
    getThroughputTrend: [],
    getTopNRecords: [],
  },
};

// getters
const getters = {
};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_DATABASES](state: State, data: any) {
    state.databases = data;
    if (!state.currentDatabase.key && data.length) {
      state.currentDatabase = data[0];
    }
  },
  [types.SET_CURRENT_DATABASE](state: State, service: any) {
    state.currentDatabase = service;
  },
  [types.SET_DATABASE_INFO](state: State, data: any) {
    state.databaseInfo.p50 = data.getP50.values;
    state.databaseInfo.p75 = data.getP75.values;
    state.databaseInfo.p90 = data.getP90.values;
    state.databaseInfo.p95 = data.getP95.values;
    state.databaseInfo.p99 = data.getP99.values;
    state.databaseInfo.getResponseTimeTrend = data.getResponseTimeTrend.values;
    state.databaseInfo.getSLATrend = data.getSLATrend.values;
    state.databaseInfo.getThroughputTrend = data.getThroughputTrend.values;
    state.databaseInfo.getTopNRecords = data.getTopNRecords;
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_DATABASES(context: { commit: Commit, rootState: any  }, params: any) {
    return graph
      .query('queryDatabases')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_DATABASES, res.data.data.services);
      });
  },
  GET_DATABASE(context: { commit: Commit, rootState: any }, params: any) {
    return graph
    .query('queryDashBoardDatabase')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit(types.SET_DATABASE_INFO, res.data.data);
    });
  },
  SELECT_DATABASE(context: { commit: Commit, dispatch: Dispatch }, params: any) {
    context.commit('SET_CURRENT_DATABASE', params);
    context.dispatch('RUN_EVENTS', {}, {root: true});
  },
};

export default {
  state: initState,
  getters,
  actions,
  mutations,
};
