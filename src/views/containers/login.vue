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
  <div class="rk-login flex-h">
    <div class="rk-login-l">
      <div class="rk-login-form-wrapper">
        <div class="rk-login-form">
          <h1 class="mb-10 title">
            <span class="grey">{{ $t('hello') }}, </span>SkyWalking Rockbot UI
          </h1>
          <div class="grey dscp">{{ $t('helloMessage') }}</div>
          <div class="sm b mb-5">{{ $t('username') }}</div>
          <input
            @keyup.enter="login"
            @input="error = false"
            class="rk-login-input mb-15"
            :class="{ 'rk-login-red': error }"
            v-model="accountInfo.userName"
            type="text"
          />
          <div class="sm b mb-5">{{ $t('password') }}</div>
          <input
            @keyup.enter="login"
            @input="error = false"
            class="rk-login-input mb-20"
            :class="{ 'rk-login-red': error }"
            v-model="accountInfo.password"
            type="password"
          />
          <a class="rk-btn dib tc cp long mb-10 rk-login-btn" @click="login">{{ $t('login') }}</a>
          <p class="grey sm">Copyright © 2018 - 2019</p>
        </div>
      </div>
    </div>
    <div class="rk-login-r hide-xs">
      <svg class="rk-img-wrapper">
        <use xlink:href="#login-bg"></use>
      </svg>
      <svg class="rk-img-logo">
        <use xlink:href="#logo-sw"></use>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import axios, { AxiosResponse } from 'axios';

  interface Account {
    userName: string;
    password: string;
  }

  @Component({})
  export default class Login extends Vue {
    private accountInfo: Account = {
      userName: '',
      password: '',
    };
    private error: boolean = false;

    // ======================================================
    // 此处为登录的业务逻辑，自行调用自己的登录接口将返回值写入localstorage
    // 修改src/router/index.js中的 beforeEach 业务，判断是否存在正确的定义值，例：skywalking-authority

    // Here is the business logic of the login, call its own login interface to write the return value to localstorage
    // Modify the beforeEach service in src/router/index.js to determine.
    // if there is a correct defined value. example：skywalking-authority
    private login() {
      if (process.env.NODE_ENV === 'development') {
        if (this.accountInfo.userName === 'admin' && this.accountInfo.password === 'admin') {
          window.localStorage.setItem('skywalking-authority', 'admin');
        } else {
          this.error = true;
          return;
        }
        this.$router.push('/');
      } else {
        axios
          .post('/login/account', this.accountInfo)
          .then((res: AxiosResponse) => {
            window.localStorage.setItem('skywalking-authority', res.data.currentAuthority);
            this.$router.push('/');
          })
          .catch(() => {
            this.error = true;
          });
      }
    }
    // ======================================================
  }
</script>

<style lang="scss">
  .rk-login {
    height: 100%;
    .title {
      font-weight: bolder;
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
    }
  }
  .rk-img-wrapper {
    width: 100%;
    height: 100%;
    animation: spin 100s linear infinite;
    background-size: 100%;
    background-position: center;
  }
  .rk-img-logo {
    position: absolute;
    top: 35%;
    left: 50%;
    margin-left: -150px;
  }
  .rk-login-input {
    width: 100%;
    border: 0;
    font-size: 16px;
    border-bottom: 1px solid #e4e7ed;
    padding: 2px 0.2em 5px;
    transition: border-color 0.3s;
    &:focus {
      outline: none;
      border-color: #6399f7;
    }
  }
  .rk-login-form-wrapper {
    display: table-cell;
    vertical-align: middle;
  }
  .rocket {
    position: absolute;
    width: 120px;
    height: 120px;
    top: 50%;
    left: 50%;
    margin-top: -60px;
    margin-left: -60px;
  }
  .rk-login-form {
    max-width: 360px;
    margin: 0 auto;
    padding-bottom: 30px;
    .dscp {
      margin-bottom: 30px;
    }
  }
  .rk-login-l {
    padding: 0 40px;
    height: 100%;
    display: table;
    flex-shrink: 0;
    margin: 0 auto;
  }
  .rk-login-r {
    position: relative;
    height: 100%;
    width: 61.8%;
    background-color: #21272b;
    overflow: hidden;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .rk-login-btn {
    padding: 8px 2em;
  }
  .rk-login-red {
    border-color: #f76363;
  }
</style>
