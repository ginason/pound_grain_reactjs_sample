export const MARKET_PAYMENT_METHOD_ARRAY = [
    { type: 'card', label: '신용/체크카드' },
    { type: 'phone', label: '핸드폰결제' },
];

export const FUNDING_PAYMENT_METHOD_ARRAY = [
    { type: 'card', label: '신용/체크카드' },
];

export const TAB_CONTENTS = {
    'COLUMN_NAME': [
        '구입일', '상품명/옵션명', '파일명(용량)', '다운로드'
    ],
    'COLUMN_SIZE': [
        '20%', '30%', '30%', '20%'
    ]
}

export const PAYMENT_STATE = {
    0: 'invoice 발행 완료',
    8: '펀딩 마감 대기 중',
    10: '결제완료',
    20: '결제실패',
    21: '결제취소',
    25: '펀딩실패',
}