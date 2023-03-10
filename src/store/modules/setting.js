import md5 from 'js-md5'
const state = {
    baseUrl:"", //直播流地址最后不包含/，如http://domain/app/stream.m3u8
    privateKey:"", //阿里云直播授权密钥
    startTime: 0, //开始时间
    endTime: 0, //结束时间
    latency: 0, //直播延迟，单位为秒
    aliyunols: true //采用时移
}

const mutations = {
    setBaseUrl(state, url) {
        state.baseUrl = url;
    },
    setPrivateKey(state, privateKey) {
        state.privateKey = privateKey;
    },
    setStartTime(state, startTime) {
        const date = new Date(startTime);
        state.startTime = date.getTime() / 1000;
    },
    setEndTime(state, endTime) {
        const date = new Date(endTime);
        state.endTime = date.getTime() / 1000;
    },
    setLatency(state, latency) {
        state.latency = latency;
    }
}

const getters = {
    authKey (state) {
        const rand = 0;
        const uid = 0;
        const timeStamp = Date.now() + 1440 * 3600;
        const pattern = /.*:\/\/.*(\/.*\/.*)/ ;
        const uri = state.baseUrl.match(pattern)[1];
        return  timeStamp+'-'+rand+'-'+uid+'-'+md5(uri+'-'+timeStamp+'-'+rand+'-'+uid+'-'+state.privateKey);
    },
    streamUrl (state,getters) {
        if (!state.privateKey || !state.baseUrl || !state.startTime || !state.endTime) {
            return ""
        }
        if(state.aliyunols) {
            return state.baseUrl + '?auth_key=' + getters.authKey + '&aliyunols=on&lhs_start_human_s_8=' + (state.startTime - state.latency) + '&lhs_vodend_human_s_8=' + (state.endTime - state.latency);
        }
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    getters
}