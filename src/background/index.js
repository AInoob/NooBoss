import { defaultValues, constantValues } from './values';
import createOptions from './Options';
import createBello from './Bello';

const NooBoss = {
	defaultValues,
	constantValues,
};
window.NooBoss = NooBoss;

NooBoss.initiate = () => {
	NooBoss.Options = createOptions(NooBoss);
	NooBoss.Options.initiate();
	NooBoss.Bello = createBello(NooBoss);
};


document.addEventListener('DOMContentLoaded', NooBoss.initiate);
