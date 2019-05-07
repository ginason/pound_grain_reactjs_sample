/**
 * @providesModule ImageManager
 */

// API
import * as HttpApi from '../Api/index';

export const uploadByFile = ( file ) => {
    return HttpApi.upload('UPLOAD_IMAGE', {
        file: file,
    }).then((response) => {
        return Promise.resolve(response.data);
    }).catch((err) => {
        // 실패하면 한번만 더 시도할 것
        return HttpApi.upload('UPLOAD_IMAGE', {
            file: file,
        }).then((response) => {
            return Promise.resolve(response.data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    });
};