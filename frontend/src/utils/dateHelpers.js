import dayjs from 'dayjs';

export const formatDateTime = (d) => (d ? dayjs(d).format('YYYY-MM-DD HH:mm') : '');


