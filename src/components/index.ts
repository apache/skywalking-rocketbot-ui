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

import RkHeader from './rk-header.vue';
import RkFooter from './rk-footer.vue';
import RkProgress from './rk-progress.vue';
import RkPage from './rk-page.vue';
import RkDate from './rk-date.vue';
import RkPanel from './rk-panel.vue';
import RkSidebox from './rk-sidebox.vue';
import RkEcharts from './rk-echarts.vue';
import noty from './noty';

const components: any = {
  RkHeader, RkFooter, RkProgress, RkDate, RkPanel, RkEcharts, RkPage, RkSidebox,
};
const componentsName: string[] = Object.keys(components);
export default {install: (vue: any) => {
  componentsName.forEach((i) => {
    vue.component(i, components[i]);
  });
  vue.use(noty);
}};
