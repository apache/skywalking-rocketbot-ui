/* eslint-disable */

export const debounce = (idle, func) => {//接收两个参数, 间隔时间和实际调用函数
  let last;//保存异步调用实际函数, 通过闭包赋值不被销毁
  return function () {
    let ctx = this,//存放函数this, 和变量给下面函数使用
        args = arguments;
    clearInterval(last);//如果该函数被调用, 则清除上一个异步调用的实际函数
    last = setTimeout(function () {//重设异步调用实际函数
      func.apply(ctx, args);//让实际函数在间隔设置的时间后调用
    }, idle)
  }
}
