import md5 from 'js-md5'

const state = {
    baseUrl: "", //直播流地址最后不包含/，如http://domain/app/stream.m3u8
    privateKey: "", //阿里云直播授权密钥
    startTime: 0, //开始时间
    endTime: 0, //结束时间
    latency: 0 //直播延迟，单位为秒
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
    authKey(state) {
        const rand = 0;
        const uid = 0;
        const timeStamp = Date.now() + 1440 * 3600;
        const pattern = /.*:\/\/.*(\/.*\/.*)/;
        const uri = state.baseUrl.match(pattern)[1];
        return timeStamp + '-' + rand + '-' + uid + '-' + md5(uri + '-' + timeStamp + '-' + rand + '-' + uid + '-' + state.privateKey);
    },
    streamUrl(state, getters) {
        let url = state.baseUrl
        if (url && url.match("^http.*m3u8$")) {
            if (state.privateKey) {
                url += '?auth_key=' + getters.authKey;
                if (state.startTime && state.endTime) {
                    url += '&aliyunols=on&lhs_start_unix_s_0=' + (state.startTime - state.latency) + '&lhs_vodend_unix_s_0=' + (state.endTime - state.latency);
                }
            } else {
                if (state.startTime && state.endTime) {
                    url += '?start=' + (state.startTime - state.latency) + '&end=' + (state.endTime - state.latency);
                }
            }
        }
        return url;
    },
    isLive(state) {
        return !(state.startTime && state.endTime);
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    getters
}
