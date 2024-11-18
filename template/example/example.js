const {Lib, Vue: VueInstance} = window;
const { createApp, ref, h, reactive } = VueInstance
const { Demo } = Lib

const App = {
  setup(props, { attrs }) {
    const text = ref(`Hello vue-demo`)
    return {
      text
    };
  },
  components: {
    Demo
  },
  template: `
    <Demo :text="text" />
  `
};

createApp(App).mount('#container')
