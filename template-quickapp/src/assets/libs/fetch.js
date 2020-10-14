import fetch from '@m.wang/fetch';
fetch.defaults.baseUrl = 'https://api.XXX.com';

const getCommonParams = async function () {
  return {};
};
// request 签名拦截器
fetch.requestUse(async function (config) {
  config.reqTimer = Date.now();
  return config;
});

// response 拦截器
fetch.responseUse(async function (res) {
  // let result = res
  // if (res.code == 200) {
  //   result = res.data
  // } else if (res.error === 'invalid_token') {
  //   let opts = res._reqOpts
  //   if (opts._retry > 3) {
  //     return result
  //   }
  //   opts._retry = opts._retry ? 1 : opts.__retry + 1
  //   return await $.get(opts)
  // }
  console.log(Date.now() - res._reqOpts.reqTimer);
  return result;
});

async function request(method, url, params, opts = {}) {
  let res = await $[method](url, params, opts);
  let err = null;
  let data = {};
  try {
    if (res.code === 200) {
      data = res.value;
    } else {
      err = res.message || res.data;
    }
  } catch (error) {
    err = error.message;
  }

  return {
    err,
    data
  };
}

export function $get() {
  let args = Array.prototype.slice.call(arguments);
  args.unshift('get');
  return request.apply(null, args);
}

export function $post() {
  let args = Array.prototype.slice.call(arguments);
  args.unshift('post');
  return request.apply(null, args);
}
