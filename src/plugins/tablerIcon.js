import * as TablerIcons from '@tabler/icons-vue';
import { h } from 'vue';

export const tablerIcon = {
  component: (props) => {
    const { icon, ...rest } = props;
    const IconComponent = TablerIcons[icon];
    return IconComponent ? h(IconComponent, { ...rest }) : null;
  },
};
