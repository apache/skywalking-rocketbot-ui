export default {
  bind(el: any, binding: any) {
    function documentHandler(e: any) {
      if (binding.arg) {
        const nodes = document.getElementsByClassName(binding.arg);
        for (const iterator of nodes) {
          if (iterator.contains(e.target)) {
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
  unbind(el: any) {
    document.removeEventListener('click', el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  },
};
