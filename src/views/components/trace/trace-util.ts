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

import { Ref, Span } from '@/types/trace';
import lodash from 'lodash';

export default class TraceUtil {
  public static buildTraceDataList(data: Span[]): string[] {
    return Array.from(new Set(data.map((span: Span) => span.serviceCode)));
  }

  public static changeTree(data: Span[], cureentTraceId: string): any[] {
    if (data.length === 0) {
      return [];
    }
    const segmentIdList: Span[] = [];
    const segmentMap: Map<string, Span[]> = new Map();
    const segmentMap2: Map<string, Span> = new Map();
    const segmentIdGroup: string[] = [];
    const fixSpans: Span[] = [];
    const segmentHeaders: Span[] = [];
    data.forEach((span) => {
      if (span.parentSpanId === -1) {
          segmentHeaders.push(span);
      } else {
        const index = data.findIndex( (patchSpan: Span) => {
          return (patchSpan.segmentId === span.segmentId && patchSpan.spanId === (span.spanId - 1));
        });

        const fixSpanKeyContent = {
          traceId: span.traceId,
          segmentId: span.segmentId,
          spanId: span.spanId - 1,
          parentSpanId: span.spanId - 2,
        };
        if (index === -1 &&  !lodash.find(fixSpans, fixSpanKeyContent) ) {
          fixSpans.push(
            {
              ...fixSpanKeyContent,
              refs: [],
              endpointName: `VNode: ${span.segmentId}`,
              serviceCode: 'VirtualNode',
              type: `[Broken] ${span.type}`,
              peer: '',
              component: `VirtualNode: #${span.spanId - 1}`,
              isError: true,
              isBroken: true,
              layer: 'Broken',
              tags: [],
              logs: [],
              startTime: 0,
              endTime: 0,
            },
          );
        }
      }
    });
    segmentHeaders.forEach((span) => {
      if (span.refs && span.refs.length) {
        span.refs.forEach((ref) => {
          const index = data.findIndex(
            (patchSpan: Span) => {
              return (ref.parentSegmentId === patchSpan.segmentId && ref.parentSpanId === patchSpan.spanId);
          });
          if (index === -1) {
            // create a known broken node.
            const parentSpanId: number = ref.parentSpanId;
            const fixSpanKeyContent = {
              traceId: ref.traceId,
              segmentId: ref.parentSegmentId,
              spanId: parentSpanId,
              parentSpanId: parentSpanId > -1 ? 0 : -1,
            };
            if (lodash.find(fixSpans, fixSpanKeyContent)) {
              fixSpans.push({
                ...fixSpanKeyContent,
                refs: [],
                endpointName: `VNode: ${ref.parentSegmentId}`,
                serviceCode: 'VirtualNode',
                type: `[Broken] ${ref.type}`,
                peer: '',
                component: `VirtualNode: #${parentSpanId}`,
                isError: true,
                isBroken: true,
                layer: 'Broken',
                tags: [],
                logs: [],
                startTime: 0,
                endTime: 0,
              });
            }
            // if root broken node is not exist, create a root broken node.
            if (fixSpanKeyContent.parentSpanId > -1) {
              const fixRootSpanKeyContent = {
                traceId: ref.traceId,
                segmentId: ref.parentSegmentId,
                spanId: 0,
                parentSpanId: -1,
              };
              if (lodash.find(fixSpans, fixRootSpanKeyContent)) {
                fixSpans.push(
                  {
                    ...fixRootSpanKeyContent,
                    refs: [],
                    endpointName: `VNode: ${ref.parentSegmentId}`,
                    serviceCode: 'VirtualNode',
                    type: `[Broken] ${ref.type}`,
                    peer: '',
                    component: `VirtualNode: #0`,
                    isError: true,
                    isBroken: true,
                    layer: 'Broken',
                    tags: [],
                    logs: [],
                    startTime: 0,
                    endTime: 0,
                  });
              }
            }
          }
        });
      }
    });
    [...fixSpans, ...data].forEach( (fixSpan: Span) => {
      fixSpan.label = fixSpan.endpointName || 'no operation name';
      fixSpan.children = [];
      if (segmentMap.get(fixSpan.segmentId) === undefined ) {
        segmentIdGroup.push(fixSpan.segmentId);
        segmentMap.set(fixSpan.segmentId, []);
        segmentMap.get(fixSpan.segmentId)!.push(fixSpan);
      } else {
        segmentMap.get(fixSpan.segmentId)!.push(fixSpan);
      }
    });
    segmentIdGroup.forEach( (segmentId: string) => {
      const currentSegmentSet = segmentMap.get(segmentId)!.sort((a, b) => b.parentSpanId - a.parentSpanId);
      currentSegmentSet.forEach( ( curSegment: Span ) => {
        const index = currentSegmentSet.findIndex(
          (curSegment2: Span) => curSegment2.spanId === curSegment.parentSpanId );
        if (index !== -1) {
          if ((currentSegmentSet[index].isBroken && currentSegmentSet[index].parentSpanId === -1)
            || !currentSegmentSet[index].isBroken) {
              currentSegmentSet[index].children!.push(curSegment);
              currentSegmentSet[index].children!.sort((a, b) => a.spanId - b.spanId);
          }
        }
        if (curSegment.isBroken) {
          const children = lodash.filter(data, (span: Span) => {
            return lodash.find(span.refs,
              {traceId: curSegment.traceId, parentSegmentId: curSegment.segmentId, parentSpanId: curSegment.spanId});
          }) as Span[];
          curSegment.children!.concat(children);
        }
      });
      segmentMap2.set(segmentId, currentSegmentSet[currentSegmentSet.length - 1]);
    });
    segmentIdGroup.forEach( (segmentId: string) => {
      if (segmentMap2.get(segmentId)!.refs) {
        segmentMap2.get(segmentId)!.refs.forEach( (ref: Ref) => {
          if (ref.traceId === cureentTraceId) {
            this.traverseTree(segmentMap2.get(ref.parentSegmentId) as Span, ref.parentSpanId, ref.parentSegmentId,
            segmentMap2.get(segmentId) as Span);
          }
        });
      }
    });
    segmentMap2.forEach((value , key) => {
      if ( value!.refs.length === 0 ) {
        segmentIdList.push(value as Span);
      }
    });
    segmentIdList.forEach( (segmentId: Span) => {
      this.collapse(segmentId);
    });
    return segmentIdList;
  }

  private static collapse(span: Span) {
    if (span.children) {
      let dur = span.endTime - span.startTime;
      span.children.forEach((chlid: Span) => {
        dur -= (chlid.endTime - chlid.startTime);
      });
      span.dur = dur < 0 ? 0 : dur;
      span.children.forEach((chlid) => this.collapse(chlid));
    }
  }

  private static traverseTree(node: Span, spanId: number, segmentId: string, childNode: Span) {
    if (!node || node.isBroken) {
      return;
    }
    if (node.spanId === spanId && node.segmentId === segmentId) {
      node.children!.push(childNode);
      return;
    }
    if (node.children && node.children.length > 0) {
      for (const item of node.children) {
        this.traverseTree(item, spanId, segmentId, childNode);
      }
    }
  }
}


