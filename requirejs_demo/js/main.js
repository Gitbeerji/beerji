requirejs.config({
	baseUrl: 'path/public',
	path: {
		app: 'app'
	}
});


requirejs(['app'],function(app){
	app.hello();
});


/**
requirejs.config({
	baseUrl: 'path/public/',
	path: {
		hello: 'hello'
	},
	shim: {
		hello: {
			init: function(){
				return {
					hello: hello,
					hello: hello2
				}
			}
		}
	}
});

requriejs(['hello'],function(hello) {
	hello.hello1();
	hello.hello2();
});
**/