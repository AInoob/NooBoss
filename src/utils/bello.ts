import { get } from './db';
import { BELLO_URL } from '../constants';
import ajax from './ajax';

export const logEvent = async (obj: {
  category: string
  action: string
  label?: string
  value?: string
}) => {
  const params = {
    type: 'event',
    category: obj.category,
    action: obj.action,
    label: obj.label,
    value: obj.value || 0,
    ua: navigator.userAgent,
    sr: screen.width + 'x' + screen.height,
    path: await get('version'),
    ul: navigator.language,
    ainoob: Math.random(),
  };
  await ajax({
    url: BELLO_URL,
    payload: params,
  });
};