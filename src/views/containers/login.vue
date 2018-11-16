<template>
<div class="rk-login flex" style="flex-direction: row;">
  <div class="rk-login-l">
    <div class="rk-login-form-wrapper">
      <div class="rk-login-form">
          <h1 class="mb10 title"><span class="grey">Hello, </span>Rocketbot</h1>
          <div class="grey dscp">Welcome Back, Apache Skywalking APM System !</div>
          <div class="sm grey mb5">Username</div>
          <input @keyup.enter="login" @input="error = false;" class="rk-login-input mb15" :class="{'rk-login-red':error}" v-model="accountInfo.userName" type="text">
          <div class="sm grey mb5">Password</div>
          <input @keyup.enter="login" @input="error = false;" class="rk-login-input mb20"  :class="{'rk-login-red':error}" v-model="accountInfo.password" type="password">
          <button class="rk-login-btn cp" @click="login">Login</button>
          <p class="grey sm">Copyright © 2018, Created by <a class="rk-login-link" target="_blank" href="https://github.com/TinyAllen">Allen Wang</a> and Supported by <a class="rk-login-link"  target="_blank" href="https://github.com/DaoCloud-Labs">DaoCloud Labs</a>.</p>
      </div>
    </div>
  </div>
  <div class="rk-login-r">
    <div class="rk-img-wrapper">
    <img src="../../assets/img/logo.svg" class="rocket">
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import dateCook from '@/utils/dateCook.ts';
import { Component } from 'vue-property-decorator';
import Axios from 'axios';

interface Account{
  userName: String;
  password: String;
}

@Component({})
export default class Login extends Vue {
  accountInfo:Account = {
    userName: '',
    password: '',
  };
  error = false;
  getCheckGq(duration) {
    this.error = this.error;
    return {
      variables: {
        duration,
      },
      query:
      `query ServiceOption($duration: Duration!) {
        applications: getAllServices(duration: $duration) {
          key: id
          label: name
        }
      }`,
    };
  }
  login() {
    Axios.post('/api/check', this.getCheckGq(dateCook({
      start: new Date(new Date().getTime() - (15 * 60 * 1000)),
      end: new Date(),
      step: 'MINUTE',
    }))).then((check) => {
      if (check.data.data) {
        window.localStorage.setItem('version', '6');
      } else {
        window.localStorage.setItem('version', '5');
      }
      // ======================================================
      // 此处为登录的业务逻辑，自行调用自己的登录接口将返回值写入localstorage
      // 修改src/router/index.js中的 beforeEach 业务，判断是否存在正确的定义值，例：skywalking-authority

      // Here is the business logic of the login, call its own login interface to write the return value to localstorage
      // Modify the beforeEach service in src/router/index.js to determine if there is a correct defined value. example：skywalking-authority

      if (this.accountInfo.userName === 'admin' && this.accountInfo.password === 'admin') {
        window.localStorage.setItem('skywalking-authority', 'admin');
      } else {
        this.error = true;
        return;
      }
      this.$router.push('/');
    });
  // ======================================================
  }
}
</script>

<style lang="scss">
.rk-login{
  height: 100%;
  .title{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
}
.rk-img-wrapper{
  width: 100%;
  height: 100%;
  background-image: url('../../assets/img/login-bg.svg');
  animation: spin 100s linear infinite;
  background-size: 100%;
  background-position: center;
}
.rk-login-link{
  color: #252a2f;
  &:hover{
    color: #252a2f;
  }
}
.rk-login-input{
  width: 100%;
  border:0;
  font-size: 16px;
  border-bottom: 1px solid #e4e7ed;
  padding: 2px 0.2em 5px;
  transition: border-color .3s;
  &:focus{
    outline: none;
    border-color: #6399f7;
  }
}
.rk-login-form-wrapper{
  display: table-cell;
  vertical-align: middle;
}
.rocket{
  position: absolute;
  width: 120px;
  height: 120px;
  top: 50%;
  left: 50%;
  margin-top: -60px;
  margin-left: -60px;
}
.rk-login-form{
  max-width: 360px;
  margin: 0 auto;
  padding-bottom: 30px;
  .dscp{
    margin-bottom: 30px;
  }
}
.rk-login-l{
  width: 38.2%;
  height: 100%;
  display: table;
}
.rk-login-r{
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
.rk-login-btn{
  background-color: #0580ff;
  color:#fff;
  outline: none;
  border: 0;
  border-radius: 6px;
  padding: 8px 2em;
  width: 100%;
  margin-bottom: 25px;
  transition: background-color .3s;
  &:hover{
    background-color: #3198ff;
  }
}
.rk-login-red{
  border-color: #f76363;
}
</style>
