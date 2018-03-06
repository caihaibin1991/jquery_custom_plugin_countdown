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
					//$(target).data("clearTime")();
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
			time: t.attr('time')
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
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'countdown', {
					options: $.extend({}, $.fn.countdown.defaults, parseOptions(this), options),
					data: {
						//按钮文本内容,用于复原
						text: getTxt(this),
						//计时器标志,用于clear时,触发
						time_id: 0
					}
				});
			}
			create(this);
			bindEvents(this);
		});
	};

	$.fn.countdown.methods = {
		parseOptions: function(jq) {
			return parseOptions(jq[0]);
		},
		options: function(jq) {
			return $.data(jq[0], 'countdown').options;
		},
		stop: function(jq) {
			return jq.each(function() {
				stop(this);
			});
		}
	};

	$.fn.countdown.defaults = {
		time: 60,
		onShowtime: function(target, time, txt) {
			console.log(target, time, txt);
		}
	};
})(jQuery);