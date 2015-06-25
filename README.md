template
=========

javascript function for parse template.

>js模版引擎，可自定义程序端标识符。默认采用<??>用来包括代码，<?=?>用来输出变量。看起来像在写PHP，由于本人在做网站时大多数使用PHP来做后端，为了方便和习惯默认采用这种方式。当然现在web方面，PHP也是非常流行的一种语言，相信这样的写法会受大多数web程序员喜欢。

##api

###1、使用字符串代码
	<script type="text/javascript">
		var tplStr = '<?if(typeof name !== \'undefined\'){?><div><?=name?></div><?}?>';
		var tplFunc = __template__('tpl1', tplStr);
		document.body.innerHTML = tplFunc({name:'James'});
	</script>
###2、使用script内部代码
	<script type="text/template" id="template_id">
        <?if(typeof name !== 'undefined'){?><div><?=name?></div><?}?>
    </script>
	<script type="text/javascript">
		var tplStr = template_id.innerHTML;
		var tplFunc = __template__('tpl1', tplStr);
		document.body.innerHTML = tplFunc({name:'James'});
	</script>
###3、使用tmpl文件
站点根目录下创建文件my.tmpl，文件内容如下：

	<?if(typeof name !== 'undefined'){?><div><?=name?></div><?}?>

调用代码为：
	
	<script type="text/javascript">
		var tplFunc = __template__('/my.tmpl');
		document.body.innerHTML = tplFunc({name:'James'});
	</script>
	