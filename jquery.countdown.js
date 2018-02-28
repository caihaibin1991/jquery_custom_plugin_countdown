(function($) {
	var methods = {
		/**
		 * 初始化计时器插件
		 * @param {Object} options
		 */
		init: function(options) {
			//传入配置
			//合并配置,初始化参数
			var settings = $.extend({
				time: 60
			}, options);
			return this.each(function(index, doc) {
				var _this = doc;
				if($(_this).data('gdp_is_init')) {
					return;
				}
				if($(_this).attr('time')) {
					//通过读取属性获取配置
					settings.time = parseInt($(_this).attr('time'));
				}
				//将变量保存到对象中,并以"gdp_"做为前缀,防止变量冲突
				//标志已初始化,防止重复初始化
				$(_this).data('gdp_is_init', 1);
				//记录原按钮文本,用于倒计时结束时,恢复显示
				$(_this).data('gdp_txt', $(_this).html());
				//绑定点击事件
				$(_this).click(function() {
					var time = settings.time;
					//禁止二次点击
					$(_this).attr('disabled', 'disabled');
					//显示倒计时结果
					$(_this).html(time + '秒');
					//获取计时器标志(int类型)
					var time_id = setInterval(function() {
						if(time <= 0) {
							//统一调用计时器插件结束动作
							$(_this).countdown('stop');
							//$(_this).data("clearTime")();
							return;
						}
						//显示倒计时结果
						$(_this).html(time + '秒');
						time--;
					}, 1000);
					//记录计时器标志到对象数据中,用于计时结束时,clear动作
					$(_this).data('gdp_time_id', time_id);
				});
			});
		},
		/**
		 * 停止计时器
		 */
		stop: function() {
			return this.each(function(index, doc) {
				var _this = doc;
				//恢复文本
				$(_this).html($(_this).data('gdp_txt'));
				//恢复点击
				$(_this).removeAttr('disabled');
				//清楚计时器对象
				clearInterval($(_this).data('gdp_time_id'));
				//				$(window).unbind('.tooltip');
			})

		}
	};
	$.fn.countdown = function(method) {
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if(typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.countdown');
		}
	};
})(jQuery);