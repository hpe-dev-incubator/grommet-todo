import { grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';

export default deepMerge(grommet, {
	global: {
		colors: {
			'grommet-pink': '#FFD6D6'
		}
	}
})