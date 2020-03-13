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

import noty from './noty';
import RkHeader from './rk-header.vue';
import RkFooter from './rk-footer.vue';
import RkFooterTime from './rk-footer-time.vue';
import RkProgress from './rk-progress.vue';
import RkPage from './rk-page.vue';
import RkDate from './rk-date.vue';
import RkPanel from './rk-panel.vue';
import RkSidebox from './rk-sidebox.vue';
import RkEcharts from './rk-echarts.vue';
import RkSelect from './rk-select.vue';
import RkPopper from './rk-popper.vue';
import RkDropdown from './rk-dropdown.vue';
import RkBack from './rk-back.vue';
import RkButton from './rk-button.vue';
import RkIcon from './rk-icon.vue';
import RkRadio from './rk-radio.vue';

const components: any = {
  RkHeader,
  RkFooter,
  RkProgress,
  RkDate,
  RkPanel,
  RkEcharts,
  RkPage,
  RkSidebox,
  RkFooterTime,
  RkSelect,
  RkPopper,
  RkDropdown,
  RkBack,
  RkButton,
  RkIcon,
  RkRadio,
};

const componentsName: string[] = Object.keys(components);
export default {
  install: (vue: any) => {
    componentsName.forEach((i) => {
      vue.component(i, components[i]);
    });
    vue.use(noty);
  },
};
