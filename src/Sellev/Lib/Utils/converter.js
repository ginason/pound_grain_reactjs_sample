/**
 * @providesModule Converter
 */

/*
* @params  {number} amount
*/
export const convertNumber2Won = ( price ) => {
    price = price.toString();
    let result = '';
    for (let i = 4; i < price.length; i++) {
        let str = price.substring(price.length - i - 1, price.length - i);
        if (i == 4) str += '만';
        if (i == 7) str += ',';
        if (i == 8) str += '억 ';
        if (i == 11) str += ',';
        if (i == 12) str += '조 ';
        result = str + result;
    }
    result = result.replace(' 0,000억', '');
    result = result.replace(' 0,000만', '');
    result = result.replace('0,00', '');
    result = result.replace('0,0', '');
    result = result.replace('0,', '');
    return result;
}
export const convertm2ToPyeong = ( m2 ) => {
    let pyeong = m2 * 0.3025;
    return pyeong.toFixed(1);
}
export const convertPyeongTom2 = ( pyeoung ) => {
    let m2 = pyeoung * 3.305785;
    return m2.toFixed(1);
}
/*
* @params  {number} center.longitude
* @params  {number} center.latitude
* @params  {number} km
*/
export const convertKmToWgs84Range = ( center, km ) => {
    let range = {
        leftTop: {
            longitude: 0,
            latitude: 0,
        },
        rightBottom: {
            longitude: 0,
            latitude: 0,
        },
    };
    range.leftTop.latitude = Number(center.latitude - ((1 / 110.574) * km));
    range.rightBottom.latitude = Number(center.latitude + ((1 / 110.574) * km));
    range.leftTop.longitude = Number(center.longitude + ((1 / (111.320 * Math.cos(range.leftTop.latitude))) * km));
    range.rightBottom.longitude = Number(center.longitude - ((1 / (111.320 * Math.cos(range.rightBottom.latitude))) * km));
    range.leftTop.longitude = Number(range.leftTop.longitude.toFixed(7));
    range.leftTop.latitude = Number(range.leftTop.latitude.toFixed(7));
    range.rightBottom.longitude = Number(range.rightBottom.longitude.toFixed(7));
    range.rightBottom.latitude = Number(range.rightBottom.latitude.toFixed(7));
    return range;
}
