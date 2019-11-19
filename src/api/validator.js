// 正则验证
/**
 * 2018/01/23
 * mark.long
 * FUN：
 * import Validate from 'validator';路径
 *  eg：mobile验证的变量  mobileValue要验证的值
 *  const validate = Validate.validate('mobile', mobileValue);
 *  const { result,errMsg } = validate;
 */
export default class Validator {
    static get REGX() {
        return {
            'amount': {
                'reg': /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/,
                'errMsg': '请填写正确的金额'
            },
            'mobile': {
                'reg': /^1[3|4|5|7|8]\d{9}$/,
                'errMsg': '请输入正确的手机号码'
            },
            'email': {
                'reg': /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                'errMsg': '请输入正确的邮箱'
            },
            'otp': {
                'reg': /^\d{6}$/,
                'errMsg': '错误的验证码'
            },
            'name': {
                'reg': /^[\u4e00-\u9fa5]([\u4e00-\u9fa5]{0,24}\u00b7{0,1}[\u4e00-\u9fa5]{1,24})+$/,
                'errMsg': '请输入正确的姓名'
            },
            'liaisonName': {
                'reg': /^[\u4e00-\u9fa5]([\u4e00-\u9fa5]{0,24}\u00b7{0,1}[\u4e00-\u9fa5]{1,24})+$/,
                'errMsg': '请输入正确的联系人姓名'
            },
            'cnid': {
                'reg': /^(\d|x|X){18}$/,
                'errMsg': '请输入正确的身份证号码'
            },
            'company_name': {
                // 'reg': /^[^@#\$%\^&\*]{2,50}$/,
                'reg': /^[（）()a-zA-Z0-9_\u4e00-\u9fa5 -]{2,50}$/,
                'errMsg': '请输入正确的公司名称'
            },
            'telephone': {
                'reg': /^(?:010|02\d|0[3-9]\d{2})\-?\d{7,8}(?:\-\d{1,4}$)?/,
                'errMsg': '请输入正确的公司电话'
            },
            'address': {
                'reg': /^[^@#\$%\^&\*]{2,50}$/,
                'errMsg': '请输入正确的地址'
            },
            'qq': {
                'reg': /^\d{5,20}$/,
                'errMsg': '请输入正确QQ号码'
            },
            'school': {
                'reg': /^\S+$/,
                'errMsg': '请输入学校名称'
            },
            'year': {
                'reg': /^\S+$/,
                'errMsg': '请选择年份'
            },
            'month': {
                'reg': /^\S+$/,
                'errMsg': '请选择月份'
            },
            'date': {
                'reg': /^\S+$/,
                'errMsg': '请选择日期'
            },
            'province': {
                'reg': /^\S+$/,
                'errMsg': '请选择省份'
            },
            'city': {
                'reg': /^\S+$/,
                'errMsg': '请选择城市'
            },
            'district': {
                'reg': /^\S+$/,
                'errMsg': '请选择区域'
            },
            'bankCard': {
                'reg': /^(\d{13,19})$/,
                'errMsg': '请输入正确的银行卡号'
            },
            'bankList': {
                'reg': /^\S+$/,
                'errMsg': '请选择银行'
            }
        }
    }
    static validate(name, value) {
        // console.log(name, value);
        var validateResult = {
                result: true,
                errMsg: ''
            },
            regs = this.REGX;
        if (regs.hasOwnProperty(name)) {
            var result = null != value && regs[name]['reg'].test(value);
            var errMsg = regs[name]['errMsg'];
            validateResult = {
                result: result,
                errMsg: errMsg
            };
        }
        return validateResult;
    }
}