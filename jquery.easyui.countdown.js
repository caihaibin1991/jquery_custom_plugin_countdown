/*******************************************************************************
 * @author caihaibin <243008827@qq.com>
 * @version 1.1.1 
 *******************************************************************************/
(function($) {

	function getTxt(target) {
		if($(target).prop("tagName") == 'INPUT') {
			return $(target).val();
		} else {
			return $(target).html();
		}
	}

	/**
	 * 根据按钮类型,自动识别文本字段来自value还是html
	 * @param {targetect} target
	 */
	function setTxt(target, txt) {
		if($(target).prop("tagName") == 'INPUT') {
			//恢复文本
			$(target).val(txt);
		} else {
			//恢复文本
			$(target).html(txt);
		}
	}
	/**
	 * 停止计时器
	 */
	function stop(target) {
		setTxt(target, $.data(target, 'countdown').data.text);
		//恢复点击
		$(target).removeAttr('disabled');
		//清除计时器对象
		clearInterval($.data(target, 'countdown').data.time_id);
	}

	function bindEvents(target) {
		//绑定点击事件
		//click.xxx为命名空间形式,可以通过unbind('.xxx')一次性解除所有该命名空间下的绑定
		//取消原".countdown"命名空间下,所有绑定事件
		$(target).unbind('.countdown');
		//直接绑定新事件
		$(target).bind('click.countdown', function() {
			var time = $.data(target, 'countdown').options.time;
			//禁止二次点击
			$(target).attr('disabled', 'disabled');
			//获取计时器标志(int类型)
			var time_id = setInterval(function() {
				if(time <= 0) {
					//统一调用计时器插件结束动作
					$(target).countdown('stop');
					$.data(target, 'countdown').options.onEnd();
					return;
				}
				$.data(target, 'countdown').options.onShowtime(target, time, time + '秒');
				//显示倒计时结果
				setTxt(target, time + '秒');
				time--;
			}, 1000);
			//记录计时器标志到对象数据中,用于计时结束时,clear动作
			$.data(target, 'countdown').data.time_id = time_id;
		});
	}

	/**
	 * 初始化计时器插件
	 * @param {Object} options
	 */
	function create(target) {}
	/**
	 * parse options from markup.
	 */
	function parseOptions(target) {
		var t = $(target);
		return $.extend({}, {
			//如果参数内容为空或undefined,不会覆盖前面的内容.如果有值,依次会覆盖前面数组的具体键值
			time: t.attr('time') ? t.attr('time') : undefined
		});
	}
	$.fn.countdown = function(options, param) {
		if(typeof options == 'string') {
			var method = $.fn.countdown.methods[options];
			if(method) {
				return method(this, param);
			}
			$.error('Method ' + options + ' does not exist on jQuery.countdown');
		}
		options = options || {};
		return this.each(function() {
			//实现针对每元素级的函数和变量
			var state = $.data(this, 'countdown');
			if(state) {
				//二次初始化,只覆盖变量,重新绑定事件等..
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'countdown', {
					//该对象所有选项,包括配置参数,传入配置,都存放在options
					//如果参数内容为空或undefined,不会覆盖前面的内容.如果有值,依次会覆盖前面数组的具体键值
					options: $.extend({}, $.fn.countdown.defaults, parseOptions(this), options),
					//该对象所有临时变量
					data: {
						//按钮文本内容,用于复原
						text: getTxt(this),
						//计时器标志,用于clear时,触发
						time_id: 0
					}
				});
			}
			//创建元素,只针对元素部分的调整.需要区分事件和元素的操作
			create(this);
			//绑定相关事件,可重复绑定;重复绑定时,通过事件命名空间进行解除
			bindEvents(this);
		});
	};
	//开放给外部调用动作
	//注:函数内部需要二次调用闭包中所定义函数,jq对象为数组,请求的闭包中的函数动作是单体.
	$.fn.countdown.methods = {
		//解析出参数配置
		parseOptions: function(jq) {
			//参数只需要一份,列表对象中参数相同,所以只需要返回首个
			return parseOptions(jq[0]);
		},
		//返回所配置参数
		options: function(jq) {
			//参数只需要一份,列表对象中参数相同,所以只需要返回首个
			return $.data(jq[0], 'countdown').options;
		},
		//停止计时动作
		stop: function(jq) {
			return jq.each(function() {
				stop(this);
			});
		}
	};
	//外部参数配置,允许参数和函数事件等
	$.fn.countdown.defaults = {
		/**
		 * 默认时长
		 */
		time: 60,
		/**
		 * 计时事件
		 * @param {Object} target
		 * @param {Object} time 当前秒数
		 * @param {Object} txt 秒数文本
		 */
		onShowtime: function(target, time, txt) {},
		/**
		 * 结束事件
		 * @param {Object} target
		 */
		onEnd: function(target) {}
	};
})(jQuery);
