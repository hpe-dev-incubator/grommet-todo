import { grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';

export default deepMerge(grommet, {
	global: {
		colors: {
			'background-1': '#FFD6D6'
		}
	}
})