<template>
<div class="rk-login flex-h">
  <div class="rk-login-l">
    <div class="rk-login-form-wrapper">
      <div class="rk-login-form">
          <h1 class="mb-10 title"><span class="grey">Hello, </span>Rocketbot</h1>
          <div class="grey dscp">Welcome Back, Apache Skywalking APM System !</div>
          <div class="sm b mb-5">Username</div>
          <input @keyup.enter="login" @input="error = false;" class="rk-login-input mb-15" :class="{'rk-login-red':error}" v-model="accountInfo.userName" type="text">
          <div class="sm b mb-5">Password</div>
          <input @keyup.enter="login" @input="error = false;" class="rk-login-input mb-20"  :class="{'rk-login-red':error}" v-model="accountInfo.password" type="password">
          <a class="rk-btn dib tc cp long mb-10 rk-login-btn" @click="login">Login Now</a>
          <p class="grey sm">Copyright © 2018, Created by <a class="blue" target="_blank" href="https://github.com/TinyAllen">Allen Wang</a> and Supported by <a class="blue"  target="_blank" href="https://github.com/DaoCloud-Labs">DaoCloud Labs</a>.</p>
      </div>
    </div>
  </div>
  <div class="rk-login-r hide-xs">
    <svg class="rk-img-wrapper">
      <use xlink:href="#login-bg"></use>
    </svg>
    <svg class="rk-img-logo">
      <use xlink:href="#logo"></use>
    </svg>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import Axios from 'axios';

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
    if (this.accountInfo.userName === 'admin' && this.accountInfo.password === 'admin') {
      window.localStorage.setItem('skywalking-authority', 'admin');
    } else {
      this.error = true;
      return;
    }
    this.$router.push('/');
  }
// ======================================================

}
</script>

<style lang="scss">
.rk-login{
  height: 100%;
  .title{
    font-weight: bolder;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
}
.rk-img-wrapper{
  width: 100%;
  height: 100%;
  animation: spin 100s linear infinite;
  background-size: 100%;
  background-position: center;
}
.rk-img-logo{
  position: absolute;
  top: 35%;
  left: 50%;
  margin-left: -150px;
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
  padding: 0 40px;
  height: 100%;
  display: table;
  flex-shrink: 0;
  margin: 0 auto;
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
  padding: 8px 2em;
}
.rk-login-red{
  border-color: #f76363;
}
</style>