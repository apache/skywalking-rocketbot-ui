<!-- Licensed to the Apache Software Foundation (ASF) under one or more
contributor license agreements.  See the NOTICE file distributed with
this work for additional information regarding copyright ownership.
The ASF licenses this file to You under the Apache License, Version 2.0
(the "License"); you may not use this file except in compliance with
the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. -->
<template>
  <component :is="tagName">
    <slot name="reference"></slot>
    <span ref="popper" v-show="!disabled && showPopper">
      <div class="popper">
        <slot></slot>
      </div>
    </span>
  </component>
</template>

<script>
  import Popper from 'popper.js';
  const on = (element, event, handler) => {
    if (element && event && handler) {
      document.addEventListener
        ? element.addEventListener(event, handler, false)
        : element.attachEvent('on' + event, handler);
    }
  };
  const off = (element, event, handler) => {
    if (element && event) {
      document.removeEventListener
        ? element.removeEventListener(event, handler, false)
        : element.detachEvent('on' + event, handler);
    }
  };
  export default {
    props: {
      tagName: {
        type: String,
        default: 'span',
      },
      trigger: {
        type: String,
        default: 'hover',
        validator: (value) =>
          [
            'clickToOpen',
            'click', // Same as clickToToggle, provided for backwards compatibility.
            'clickToToggle',
            'hover',
            'focus',
          ].indexOf(value) > -1,
      },
      delayOnMouseOver: {
        type: Number,
        default: 10,
      },
      delayOnMouseOut: {
        type: Number,
        default: 10,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      boundariesSelector: String,
      reference: {},
      forceShow: {
        type: Boolean,
        default: false,
      },
      dataValue: {
        default: null,
      },
      appendToBody: {
        type: Boolean,
        default: false,
      },
      stopPropagation: {
        type: Boolean,
        default: false,
      },
      preventDefault: {
        type: Boolean,
        default: false,
      },
      options: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        referenceElm: null,
        popperJS: null,
        showPopper: false,
        currentPlacement: '',
        popperOptions: {
          placement: 'bottom-start',
          computeStyle: {
            gpuAcceleration: false,
          },
        },
      };
    },
    watch: {
      showPopper(value) {
        if (value) {
          this.$emit('show', this);
          if (this.popperJS) {
            this.popperJS.enableEventListeners();
          }
          this.updatePopper();
        } else {
          if (this.popperJS) {
            this.popperJS.disableEventListeners();
          }
          this.$emit('hide', this);
        }
      },
      forceShow: {
        handler(value) {
          this[value ? 'doShow' : 'doClose']();
        },
        immediate: true,
      },
      disabled(value) {
        if (value) {
          this.showPopper = false;
        }
      },
    },
    created() {
      this.appendedArrow = false;
      this.appendedToBody = false;
      this.popperOptions = Object.assign(this.popperOptions, this.options);
    },
    mounted() {
      this.referenceElm = this.reference || this.$slots.reference[0].elm;
      this.popper = this.$slots.default[0].elm;
      switch (this.trigger) {
        case 'clickToOpen':
          on(this.referenceElm, 'click', this.doShow);
          on(document, 'click', this.handleDocumentClick);
          break;
        case 'click': // Same as clickToToggle, provided for backwards compatibility.
        case 'clickToToggle':
          on(this.referenceElm, 'click', this.doToggle);
          on(document, 'click', this.handleDocumentClick);
          break;
        case 'hover':
          on(this.referenceElm, 'mouseover', this.onMouseOver);
          on(this.popper, 'mouseover', this.onMouseOver);
          on(this.referenceElm, 'mouseout', this.onMouseOut);
          on(this.popper, 'mouseout', this.onMouseOut);
          break;
        case 'focus':
          on(this.referenceElm, 'focus', this.onMouseOver);
          on(this.popper, 'focus', this.onMouseOver);
          on(this.referenceElm, 'blur', this.onMouseOut);
          on(this.popper, 'blur', this.onMouseOut);
          break;
      }
    },
    methods: {
      doToggle(event) {
        if (this.stopPropagation) {
          event.stopPropagation();
        }
        if (this.preventDefault) {
          event.preventDefault();
        }
        if (!this.forceShow) {
          this.showPopper = !this.showPopper;
        }
      },
      doShow() {
        this.showPopper = true;
      },
      doClose() {
        this.showPopper = false;
      },
      doDestroy() {
        if (this.showPopper) {
          return;
        }
        if (this.popperJS) {
          this.popperJS.destroy();
          this.popperJS = null;
        }
        if (this.appendedToBody) {
          this.appendedToBody = false;
          document.body.removeChild(this.popper.parentElement);
        }
      },
      createPopper() {
        this.$nextTick(() => {
          if (this.appendToBody && !this.appendedToBody) {
            this.appendedToBody = true;
            document.body.appendChild(this.popper.parentElement);
          }
          if (this.popperJS && this.popperJS.destroy) {
            this.popperJS.destroy();
          }
          if (this.boundariesSelector) {
            const boundariesElement = document.querySelector(this.boundariesSelector);
            if (boundariesElement) {
              this.popperOptions.modifiers = Object.assign({}, this.popperOptions.modifiers);
              this.popperOptions.modifiers.preventOverflow = Object.assign(
                {},
                this.popperOptions.modifiers.preventOverflow,
              );
              this.popperOptions.modifiers.preventOverflow.boundariesElement = boundariesElement;
            }
          }
          this.popperOptions.onCreate = () => {
            this.$emit('created', this);
            this.$nextTick(this.updatePopper);
          };
          this.popperJS = new Popper(this.referenceElm, this.popper, this.popperOptions);
        });
      },
      destroyPopper() {
        off(this.referenceElm, 'click', this.doToggle);
        off(this.referenceElm, 'mouseup', this.doClose);
        off(this.referenceElm, 'mousedown', this.doShow);
        off(this.referenceElm, 'focus', this.doShow);
        off(this.referenceElm, 'blur', this.doClose);
        off(this.referenceElm, 'mouseout', this.onMouseOut);
        off(this.referenceElm, 'mouseover', this.onMouseOver);
        off(document, 'click', this.handleDocumentClick);
        this.showPopper = false;
        this.doDestroy();
      },
      updatePopper() {
        this.popperJS ? this.popperJS.scheduleUpdate() : this.createPopper();
      },
      onMouseOver() {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          this.showPopper = true;
        }, this.delayOnMouseOver);
      },
      onMouseOut() {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          this.showPopper = false;
        }, this.delayOnMouseOut);
      },
      handleDocumentClick(e) {
        if (
          !this.$el ||
          !this.referenceElm ||
          this.elementContains(this.$el, e.target) ||
          this.elementContains(this.referenceElm, e.target) ||
          !this.popper ||
          this.elementContains(this.popper, e.target)
        ) {
          return;
        }
        this.$emit('documentClick', this);
        if (this.forceShow) {
          return;
        }
        this.showPopper = false;
      },
      elementContains(elm, otherElm) {
        if (typeof elm.contains === 'function') {
          return elm.contains(otherElm);
        }
        return false;
      },
    },
    destroyed() {
      this.destroyPopper();
    },
  };
</script>
<style lang="scss">
  .popper {
    z-index: 11;
  }
  .popper .popper__arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
  }
  .popper[x-placement^='top'] {
    margin-bottom: 5px;
  }
  .popper[x-placement^='top'] .popper__arrow {
    border-width: 5px 5px 0 5px;
    border-color: #fafafa transparent transparent transparent;
    bottom: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
  }
  .popper[x-placement^='bottom'] {
    margin-top: 5px;
  }
  .popper[x-placement^='bottom'] .popper__arrow {
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent #fafafa transparent;
    top: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
  }
  .popper[x-placement^='right'] {
    margin-left: 5px;
  }
  .popper[x-placement^='right'] .popper__arrow {
    border-width: 5px 5px 5px 0;
    border-color: transparent #fafafa transparent transparent;
    left: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
  }
  .popper[x-placement^='left'] {
    margin-right: 5px;
  }
  .popper[x-placement^='left'] .popper__arrow {
    border-width: 5px 0 5px 5px;
    border-color: transparent transparent transparent #fafafa;
    right: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
  }
</style>
