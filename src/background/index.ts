import { logEvent } from '../utils/bello';

console.log('bello');

const init = async () => {
  await logEvent({
    category: 'test',
    action: 'test',
  });
}

init();
