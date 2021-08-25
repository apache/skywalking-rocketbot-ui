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
    <div class="rk-modal-bg" v-show="show" @mousemove="modalMove" @mouseup="cancelMove">
        <div class="rk-modal-container">
            <div class="rk-modal-header" @mousedown="setStartingPoint">
                <span class="title">{{ this.title }}</span>
                <div class="r rk-modal-close" @click="cancel">
                    <svg class="icon">
                        <use xlink:href="#close"></use>
                    </svg>
                </div>
            </div>
            <div class="rk-modal-main">
                <slot></slot>
            </div>
            <div v-if="showButton" class="rk-modal-footer">
                <rk-button @click="confirm">{{ $t('confirm') }}</rk-button>
            </div>
        </div>
    </div>
</template>
<script lang="js">
    import RkButton from '@/components/rk-button';
    export default {
        name: 'RkModal',
        components: {RkButton},
        props: {
            show: {
                type: Boolean,
                default: false,
            },
            showButton: {
                type: Boolean,
                default: false,
            },
            title: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                x: 0,
                y: 0,
                node: null,
                isCanMove: false,
            };
        },
        mounted() {
            this.node = document.querySelector('.rk-modal-container');
        },
        methods: {
            cancel() {
                this.$emit('update:show', false);
                this.$emit('cancelModalCallback');
            },

            confirm() {
                this.$emit('update:show', false);
                this.$emit('confirmModalCallback');
            },

            setStartingPoint(e) {
                this.x = e.clientX - this.node.offsetLeft;
                this.y = e.clientY - this.node.offsetTop;
                this.isCanMove = true;
            },

            modalMove(e) {
                if (this.isCanMove) {
                    this.node.style.left = e.clientX - this.x + 'px';
                    this.node.style.top = e.clientY - this.y + 'px';
                }
            },

            cancelMove() {
                this.isCanMove = false;
            },
        },
    };
</script>

<style lang="scss">
    .rk-modal-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        z-index: 10;
    }

    .rk-modal-container {
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .rk-modal-header {
        height: 35px;
        background: #252a2f;
        color: #efefef;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: move;
    }

    .rk-modal-close {
        position: absolute;
        right: 10px;
        top: 5px;
        cursor: pointer;
        color: #d8d8d8;
        transition: color 0.3s;

        .icon {
            width: 18px;
            height: 20px;
        }

        &:hover {
            color: #3d92ff;
        }
    }

    .rk-modal-main {
        padding: 15px 40px;
    }

    .rk-modal-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 35px;
        border-top: 1px solid #ddd;
    }
</style>
