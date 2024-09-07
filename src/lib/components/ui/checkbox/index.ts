import type { Checkbox as CheckboxPrimitive } from 'bits-ui';
import Root from './checkbox.svelte';

type Size = 'default' | 'sm' | undefined;

type Props = CheckboxPrimitive.Props & {
	size?: Size;
};

export {
	Root,
	//
	Root as Checkbox,
	type Props as CheckboxProps,
};
