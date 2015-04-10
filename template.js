(function(window){
    var jsExp = new RegExp('<\\?.*?\\?>', 'g');
	var valueExp = new RegExp('<\\?=.*?\\?>', 'g');
	 
	var jsPrefixLength = '<?'.length;
	var jsSuffixLength = '?>'.length;
	 
	var valuePrefixLength = '<?='.length;
	var valueSuffixLength = '?>'.length;
    
	var templates = {};
	var template_functions = {};

	window.__template__ = function(src,html){
		if(typeof template_functions[src] !== 'function'){
			var func = function(param){
				var template = createTemplate(src,html);
			    var fn = new Function('param', template);
			    return fn(param);
		    };
		    template_functions[src] = func;
		}
		return template_functions[src];
	};
	
	function createTemplate(src,html){
		var template = '';
		if(typeof src == 'string'){
			if(typeof templates[src] == 'undefined'){
				if(typeof html == 'string'){
					template = templates[src] = parseTemplate(html);
				}else{
					ajax({
						async:false,
						url:src,
						success:function(str){
							template = templates[src] = parseTemplate(str);
						}
					});
				};
			}else{
				template = templates[src];
			};
		};
		return template;
	}
	 
	function parseTemplate(template) {
        var tpl = '';
		if(typeof template == 'string' && template.length > 0){
			tpl = template.replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\"/g, '\\\"').replace(/\'/g, "\\'"); 
		    tpl = tpl.replace(valueExp, function(data) {
		        data = data.substring(valuePrefixLength, data.length - valueSuffixLength).replace(/\\\"/g, '"').replace(/\\\'/g, "'");
		        return '\"+(' + data + ')+\"';
		    });
		    tpl = tpl.replace(jsExp, function(data) {
		        data = data.substring(jsPrefixLength, data.length - jsSuffixLength).replace(/\\"/g, '\"').replace(/\\'/g, '\'').replace(/\\r|\\n/g, '');
		        return '\";' + data + '__o+=\"';
		    });
		}
	    return 'with(param || {}){var __o=\"' + tpl  + '\";return __o;}';
	};

	var ajax = function(opts){
		var XMLHttpReq;
	    try {
	    	XMLHttpReq = new XMLHttpRequest();
	    }
	    catch(e) {
	        try {
	            XMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	        }
	        catch(e) {
	            XMLHttpReq = new ActiveXObject("Msxml2.XMLHTTP");
	        };
	    };
	    XMLHttpReq.open(opts.type || 'get', opts.url, opts.async);
	    XMLHttpReq.onreadystatechange = processResponse;
	    XMLHttpReq.send(opts.data);
		function processResponse() {
		    if (XMLHttpReq.readyState == 4) {
		        if (XMLHttpReq.status == 200) {
		            var text = XMLHttpReq.responseText;
		            opts && typeof opts.success == 'function' ? opts.success(text) : null;
		        };
		    };
		};
	};
    
    //amd like requirejs
    if(typeof define === "function" && define.amd){
        define('template',[],function(){
            return {__template__:__template__};
        });
    }
    
    //cmd like CommonJS
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = global.document ? {__template__:__template__} : function( w ) {
                if ( !w.document ) {
                    throw new Error( "template requires a window with a document" );
                }
                return {__template__:__template__};
            };
    }
})(this);
