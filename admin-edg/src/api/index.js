'use strict';

/**
 * 统一存放所有的api请求地址
 * 在所有的组件中使用方法：this.$api.接口属性名 (/api应用了本地跨域代理，发布线上后会自动除去)
 *
 * 请注意：添加接口，请在对应模块下添加
 * 
 * 
 */
let isProduct = process.env.NODE_ENV == 'production' ? true : false;//是否是生产环境
let isTest = process.env.NODE_ENV == 'exam' ? true : false;//是否是测试环境---如果两个都不是则是本地环境
let systemPre = 'xtznUser'; //系统模块前缀

let apiUrl = {
	//系统接口
	system: {
		login:systemPre+ '/login',		//登录接口
		register: '',	//注册接口
	},

	//联盟模块接口
	data: {
	
	},


};
export default apiUrl;
