import { defineComponent, DefineComponent } from 'vue';

import { Props } from "./propTypes";

type DemoProps = DefineComponent<Props>['props'];

const Demo = defineComponent({
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  setup(props: DemoProps, { emit, slots }) {
    return () => (
      <div>{props.text}</div>
    );
  },
});

export { Demo }