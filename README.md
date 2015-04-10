template
=========

javascript function for parse template.

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
	