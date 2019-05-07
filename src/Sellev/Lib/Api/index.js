import axios from 'axios';
import apiConfig from './config';

export const get = (path, parameters = {}) => {
    console.log('/Lib/Api/index.js :: GET :: ' + apiConfig[path]);
    let realPath;
    if (typeof parameters === 'object') {
        parameters.updateCallback = new Date();
    }
    if (parameters.param) {
        realPath = apiConfig[path].replace(/:productId|:hashtagId|:userId/g, parameters.param);
    } else {
        realPath = apiConfig[path].replace(/:productId|:hashtagId|:userId/g, parameters);
    }
    return axios.get(apiConfig.url + realPath, { params: parameters })
        .then((response) => {
            console.log('/Lib/Api/index.js :: GET :: ' + path + ' :: Success!');
            return Promise.resolve(response);
        })
        .catch((err) => {
            console.log('/Lib/Api/index.js :: GET :: ' + path + ' :: Failed!');
            //console.log(err);
            return Promise.reject(err);
        });
};
export const post = (path, parameters = {}) => {
    console.log('/Lib/Api/index.js :: POST :: ' + apiConfig[path]);
    let realPath;
    if (typeof parameters === 'object') {
        parameters.updateCallback = new Date();
    }
    console.log(apiConfig[path])
    if (parameters.param) {
        realPath = apiConfig[path].replace(/:productId|:hashtagId|:userId|:commentId/g, parameters.param);
    } else {
        realPath = apiConfig[path].replace(/:productId|:hashtagId|:userId|:commentId/g, parameters);
    }
    console.log(parameters);
    console.log(realPath);
    console.log(apiConfig.url + realPath);
    return axios.post(apiConfig.url + realPath, parameters)
        .then((response) => {
            console.log('/Lib/Api/index.js :: POST :: ' + path + ' :: Success!');
            return Promise.resolve(response);
        })
        .catch((err) => {
            console.log('/Lib/Api/index.js :: POST :: ' + path + ' :: Failed!');
            console.log(err);
            return Promise.reject(err);
        });
};

export const del = (path, parameters = {}) => {
    console.log('/Lib/Api/index.js :: DELETE :: ' + apiConfig[path]);

    return axios.delete(apiConfig.url + apiConfig[path], parameters)
        .then((response) => {
            console.log('/Lib/Api/index.js :: DELETE :: ' + path + ' :: Success!');
            return Promise.resolve(response);
        })
        .catch((err) => {
            console.log('/Lib/Api/index.js :: DELETE :: ' + path + ' :: Failed!');
            console.log(err);
            return Promise.reject(err);
        });
};

export const upload = (path, parameters = {}) => {
    console.log('/Lib/Api/index.js :: UPLOAD :: ' + apiConfig[path]);
    parameters.updateCallback = new Date();
    const body = new FormData();
    body.append('file', parameters.file);
    return axios.post(apiConfig.url + apiConfig[path], body, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((response) => {
            console.log('/Lib/Api/index.js :: UPLOAD :: ' + path + ' :: Success!');
            return Promise.resolve(response);
        })
        .catch((err) => {
            console.log('/Lib/Api/index.js :: UPLOAD :: ' + path + ' :: Failed!');
            console.log(err);
            return Promise.reject(err);
        });
}

// 참조문서1: axios => https://github.com/mzabriskie/axios
