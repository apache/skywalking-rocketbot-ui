/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Popper from 'popper.js';
import './tooltip.scss';

function setProperties(el: any, binding: any) {
  el.popper._appendToBody = !(binding.value.appendToBody === false);
  if (binding.modifiers.always) {
    el.popper._always = binding.modifiers.always;
  }
  if (binding.modifiers.controlled) {
    el.popper._controlled = binding.modifiers.controlled;
  }
  if (binding.modifiers.ellipsis) {
    el.popper._ellipsis = binding.modifiers.ellipsis;
  }
  if (typeof binding.value === 'object') {
    el.popper._content = binding.value.content || '';
    el.popper._delay = binding.value.delay;
    el.popper._disabled = binding.value.disabled;
  } else if (typeof binding.value === 'string') {
    el.popper._content = binding.value;
  } else {
    el.popper._content = binding.expression;
  }
}

function setAttributes($inner: any, el: any) {
  const popper = el.popper;
  $inner.innerHTML = el.popper._content;
  if (!popper.popper) {
    return;
  }
  const isShow =
    !popper._disabled &&
    (popper._visible || popper._always) &&
    (!popper._ellipsis || isEllipsisTooltip(el));

  if (popper._appendToBody) {
    if (isShow && popper.popper.parentNode !== document.body) {
      document.body.appendChild(popper.popper);
    }
    if (!isShow && popper.popper.parentNode === document.body) {
      document.body.removeChild(popper.popper);
    }
  } else {
    popper.popper.style.display = isShow ? '' : 'none';
  }
}

function handleShowPopper(e: any) {
  const el = e.currentTarget;
  el.popper._timer = setTimeout(() => {
    el.popper._visible = true;
    setAttributes(el.$inner, el);
    el.popper.update();
  }, el.popper._delay || 0);
}

function handleClosePopper(e: any) {
  const el = e.currentTarget;
  clearTimeout(el.popper._timer);
  if (!el.popper._controlled) {
    el.popper._visible = false;
    setAttributes(el.$inner, el);
    el.popper.update();
  }
}

// 添加事件
function addEvent(el: any) {
  el.addEventListener('mouseenter', handleShowPopper);
  el.addEventListener('mouseleave', handleClosePopper);
}

// 移除事件
function removeEvent(el: any) {
  el.removeEventListener('mouseenter', handleShowPopper);
  el.removeEventListener('mouseleave', handleClosePopper);
}

function isEllipsisTooltip(el: any) {
  return el.offsetWidth < el.scrollWidth;
}

export default {
  bind(el: any, binding: any, vnode: any) {
    const placement = binding.arg || 'top';

    const $popper = document.createElement('div');
    $popper.setAttribute('class', 'rk-tooltip-popper');

    const $content = document.createElement('div');
    $content.setAttribute('class', 'rk-tooltip-content');

    const $arrow = document.createElement('div');
    $arrow.setAttribute('class', 'rk-tooltip-arrow');
    $content.appendChild($arrow);

    const $inner = document.createElement('div');
    $inner.setAttribute('class', 'rk-tooltip-inner');

    $content.appendChild($inner);
    $popper.appendChild($content);
    if (binding.value) {
      if (binding.value.appendToBody === false) {
        $popper.style.display = 'none';
        el.appendChild($popper);
      } else {
        $popper.className += ` append-to-body ${
          binding.value.popperCls ? binding.value.popperCls.join(' ') : ''
        }`;
      }
    }

    const options = Object.assign({}, binding.value, { placement });

    el.$inner = $inner;
    el.popper = new Popper(el, $popper, options);
    setProperties(el, binding);
    setAttributes($inner, el);
  },
  inserted(el: any, binding: any, vnode: any, oldVnode: any) {
    addEvent(el);
  },
  unbind(el: any, binding: any, vnode: any, oldVnode: any) {
    removeEvent(el);
    el.popper.destroy();
    if (binding.value.appendToBody === false) {
      if (el.popper.popper) {
        el.removeChild(el.popper.popper);
      }
    } else if (
      el.popper.popper &&
      el.popper.popper.parentNode === document.body
    ) {
      document.body.removeChild(el.popper.popper);
    }
  },
  componentUpdated(el: any, binding: any, vnode: any, oldVnode: any) {
    setProperties(el, binding);
    setAttributes(el.$inner, el);
  },
};
