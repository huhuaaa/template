(function(){
    //js语句正则
    var jsRegExp = new RegExp('<%(.*?)%>', 'g')
    //值html转码后输出正则
    var valueHtmlRegExp = new RegExp('<%=(.*?)%>', 'g')
    //值直接输出正则
    var valueRegExp = new RegExp('<%==(.*?)%>', 'g')

    var jsPrefixLength = '<%'.length;
	var jsSuffixLength = '%>'.length;
	 
	var valuePrefixLength = '<%='.length;
	var valueSuffixLength = '%>'.length;
    var valueHtmlPrefixLength = '<%=='.length;
	var valueHtmlSuffixLength = '%>'.length;
    
    //模版函数缓存
    var cache = {}
    /**
     * 字符转html编码
     * @param String str
     * @return String
     */
    function htmlspecialchars(str){
        //处理主要会引起html结构混乱的字符(&<>\"')
        return str.replace(/&/g,'&amp;')
                .replace(/</g,'&lt;')
                .replace(/>/g,'&gt;')
                .replace(/\\/g,'&#92;')
                .replace(/"/g,'&quot;')
                .replace(/'/g,'&#39;')
    }
    /**
     * 模版解析函数
     * @param String template
     * @return String
     */
    function parseTemplate(template) {
        var tpl = ''
        if(typeof template == 'string' && template.length > 0){
            tpl = template.replace(/(["'])/g, '\\$1')
                    // 保留换行
                    .replace(/\n/g, '\\n').replace(/\r/g, '\\r')
                    // .replace(/\t/g, '\\t')
                    // 压缩代码，去掉多余空白符
                    .replace(/>\s+/g, '>').replace(/\s+</g, '<')
            tpl = tpl.replace(valueRegExp, function(data) {
		        data = data.substring(valueHtmlPrefixLength, data.length - valueHtmlSuffixLength).replace(/\\\"/g, '"').replace(/\\\'/g, "'");
		        return '\"+(' + data + ')+\"';
		    })
            tpl = tpl.replace(valueHtmlRegExp, function(data) {
		        data = data.substring(valuePrefixLength, data.length - valueSuffixLength).replace(/\\\"/g, '"').replace(/\\\'/g, "'");
		        return '\"+htmlspecialchars(' + data + ')+\"';
		    })
		    tpl = tpl.replace(jsRegExp, function(data) {
		        data = data.substring(jsPrefixLength, data.length - jsSuffixLength).replace(/\\"/g, '\"').replace(/\\'/g, '\'').replace(/\\r|\\n/g, '');
		        return '\";' + data + '__t+=\"';
		    })
                    // .replace(valueRegExp, '"+($1)+"')
                    // .replace(valueRegExp, '"+($1)+"')
                    // .replace(valueHtmlRegExp, '"+htmlspecialchars($1)+"')
                    // .replace(jsRegExp, '";$1;__t+="')
        }
        tpl = 'with(param || {}){var __t="' + tpl  + '";return __t;}'
        // console.log(tpl)
        return tpl
    };
    /**
     * 模版构建函数
     * @param String tpl
     * @param JSON data
     * @return function
     */
    function templateFactory(tpl, data){
        //模版函数缓存
        if(cache[tpl]){
            return cache[tpl](htmlspecialchars, data)
        }else{
            var str = parseTemplate(tpl)
            //创建模版函数（消耗性能的语句）
            var fun = new Function(['htmlspecialchars', 'param'], str)
            //记录模版函数到缓存
            cache[tpl] = fun
            return fun(htmlspecialchars, data)
        }
    }
    //扩展方法，兼容nodejs
    typeof module === 'object' && typeof module.exports === 'object' ? (module.exports = templateFactory) : (this.templateFactory = templateFactory)
})(this)
