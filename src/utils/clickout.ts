/* eslint-disable */
export default {
  bind(el, binding) {
    function documentHandler(e) {
      if (binding.arg) {
        const nodes = document.getElementsByClassName(binding.arg);
        for (let i = 0; i < nodes.length; i += 1) {
          if (nodes[i].contains(e.target)) {
            return false;
          }
        }
      }

      if (el.contains(e.target)) {
        return false;
      }
      if (binding.expression) {
        binding.value(e);
      }
    }
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  unbind(el) {
    document.removeEventListener('click', el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  },
};
