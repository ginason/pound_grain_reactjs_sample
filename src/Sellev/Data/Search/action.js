// API
import * as HttpApi from '../../Lib/Api/index';

/*
* other constants
*/

//////////////////
///// GET ////////
//////////////////
/*
 *  @apiParam {String} searchQuery
 */
export const getTopSearch = (params) => {
    return HttpApi.get('GET_TOP_SEARCH', params)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

//////////////////
///// POST ///////
//////////////////
