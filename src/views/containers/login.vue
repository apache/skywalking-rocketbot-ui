<template>
<div class="rk-login flex">
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
          <p class="grey sm">Copyright © 2018, Created by <a class="rk-login-link" href="https://github.com/TinyAllen">Allen Wang</a> and Supported by <a class="rk-login-link">DaoCloud Labs</a>.</p>
      </div>
    </div>
  </div>
  <div class="rk-login-r">
    <img src="../../assets/img/rocket.svg" class="rocket">
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { login } from '@/api/index.ts';
import { Component } from 'vue-property-decorator';

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
  login() {
    login(this.accountInfo).then((res) => {
      window.localStorage.setItem('skywalking-authority', res.data.currentAuthority);
      if (res.data.status === 'error') {
        this.error = true;
        return;
      }
      this.$router.push('/');
    });
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
  width: 280px;
  height: 280px;
  top: 50%;
  left: 50%;
  margin-top: -140px;
  margin-left: -140px;
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
  width: 75%;
  height: 100%;
  display: table;
}
.rk-login-r{
  position: relative;
  height: 100%;
  width: 100%;
  background-color: #252a2f;
  background-image: url('../../assets/img/login-bg.svg');
  // background-position: center;
  background-size: 100%;
}
.rk-login-btn{
  background-color: #252a2f;
  color:#e4e7ed;
  outline: none;
  border: 0;
  border-radius: 6px;
  padding: 8px 2em;
  width: 100%;
  margin-bottom: 25px;
}
.rk-login-red{
  border-color: #f76363;
}
</style>
