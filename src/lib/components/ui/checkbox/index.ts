import Root from "./checkbox.svelte";
import { Checkbox as CheckboxPrimitive } from "bits-ui";

type Size = "default" | "sm" | undefined;

type Props = CheckboxPrimitive.Props & {
	size?: Size;
};

export {
	Root,
	//
	Root as Checkbox,
	type Props as CheckboxProps,
};
