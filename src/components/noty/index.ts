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
import Noty from 'noty';
import './noty.css';
import './bootstrap-v4.css';

const defaults = {
  layout: 'topRight',
  theme: 'bootstrap-v4',
  timeout: 4000,
  progressBar: true,
  closeWith: ['click'],
};

const VueNoty = {
  options: {},

  setOptions(opts: any) {
    this.options = Object.assign({}, defaults, opts);
    return this;
  },

  show(text: any, type = 'alert', opts = {}) {
    const params: any = Object.assign({}, this.options, opts, {
      type,
      text,
    });

    return new Noty(params).show();
  },

  closeAll(text: any = null) {
    if (text) {
      Noty.closeAll(text);
    } else {
      Noty.closeAll();
    }
  },

  setMaxVisible(num: any, text: any = null) {
    if (text) {
      Noty.setMaxVisible(num, text);
    } else {
      Noty.setMaxVisible(num);
    }
  },

  success(text: any, opts = {}) {
    return this.show(text, 'success', opts);
  },

  error(text: any, opts = {}) {
    return this.show(text, 'error', opts);
  },

  warning(text: any, opts = {}) {
    return this.show(text, 'warning', opts);
  },

  info(text: any, opts = {}) {
    return this.show(text, 'info', opts);
  },
};

export default {
  install: (Vue: any, opts: any) => {
    const noty = VueNoty.setOptions(opts);
    Vue.prototype.$noty = noty;
    Vue.noty = noty;
  },
};
