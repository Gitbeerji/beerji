### RequireJS

RequireJS提供一下功能

- 声明不同js文件之间的依赖
- 可以按需，并行， 延时载入js库
- 可以代码以模块化的方式组织

#### 在html中引入requirejs

在HTML中，添加这样的 <script>标签：    

`<script src="/path/to/require.js" data-main="/path/to/app/config.js"></script>`

通常使用requirejs的话，我们只需要导入require即可们不需要显示导入其他js库，因为这个工作会交个requirejs来做

属性 data-main是告诉requirejs： 你下载完以后，马上去载入真正的入口文件，他一般用来对require进行配置，并且载入真正的程序模块。

#### 在config.js中配置requirejs

config.js中通常用来做两件事：

1. 配置requirejs 比如项目中用到哪些模块，文件路径是什么
2. 载入程序主模块

```javascript

requirejs.config({
	baseUrl: '/public/js',
	paths: {
		app: 'app'
	}
});

requirejs(['app'],function(app){
	app.hello();
});

```

在paths中，我们声明了一个名为app的模块，以及他对应的js文件地址，在最理想的情况下，app.js的内容，应该使用requirejs的方式来定义模块：

```javascript

define([],function(){
	return {
		hello: function() {
			alert("hello,app");
		}	
	}
})


```

这里的define是requirejs提供的函数，requirejs一共提供两个全局变量：

1. requirejs/require：用来配置requirejs及载入入口模块，如果其中一个命名被其他库使用，我们可以用另一个
2. define： 定义一个模块

另外还可以吧require当做依赖的模块，然后调用它的方法：
```javascript
define(["require"],function(require){
	var cssUrl = require.toUrl("./style.css")
});

```

#### 依赖一个不使用requirejs方式的库

前面的代码是理想的情况，即依赖的js文件，里面用了define(...)这样的方式来组织代码的，如果没用这种方式，会出现什么情况呢？

比如这个 `hello.js`

```javascript

function hello(){
	alert('hello,world');
}

```

它就按普通的方式定义了一个函数，我们能在requirejs里使用他吗？

```javascript

requirejs.config({
	baseUrl: '/public/js',
	path: {
		hello: 'hello'
	}
});

requirejs(['hello'],function(hello) {
	hello();	
});
```

这段代码会报错，提示：

`Uncaught TypeError: undefined is not a function`

原因是最后调用hello()的时候，这个hello是undefined，这说明，虽然我们依赖了一个js库(它会被载入)，但是requirejs无法从中拿到代表它对象注入进来供我们使用。

在这种情况下，我们要使用 `shim`，将某个依赖中的某个全局变量暴露给requirejs，当做这个模块本身的引用。

```javascript

requirejs.config({
	baseUrl: '/public/js',
	paths: {
		hello: 'hello'
	},
	shim: {
		hello: { exports: 'hello'}	
	}
});

requirejs(['hello'],function(hello) {
	hello();
});

```

在运行就正常了。

上面代码 `exports: 'hello'`中的 hello，是我们在hello.js中定义的hello函数。当我们使用 function hello(){}的方式定义一个函数的时候，它就是全局可用的。如果我们选择了把它 export 给 requirejs，那放我们的代码依赖于hello模块的时候，就可以拿到这个hello函数的引用了。

所有， exports可以把某个非requirejs方式的代码中的某一个全局变量暴露出去，当做该模块以引用。

#### 暴露多个变量： init

但如果我要同事暴露多个全局变量呢？ 比如，hello.js 的定义其实是这样的：

```javascript

function hello() {
	alert('hello,world');
}

function hello2 () {
	alert('hello,world,again');
}

```

它定义了两个函数，而我两个都想使用

这时就不能在用 exports 了，必须换成 init 函数：

```javascript

require.config({
	baseUrl: '/public/js',
	paths: {
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

requirejs(['hello'],function(hello) {
	hello.hello1();
	hello.hello2();
});

```

当 exports 与 init 同时存在的时候， exports 将被忽略。

#### 无主的与有主的模块

我遇到一个折腾我不少时间的问题： 为什么我只能使用 jquery 来依赖 jquery 而不能用其他的名字？

比如下面这段代码

```javascript

requirejs.config({
	baseUrl: '/public/js',
	paths: {
		myjquery: 'lib/jquery/jquery'
	}

});

requirejs(['myjquery'],function(jq) {
	alert(jq);
});

```

它会提醒我：

`jq is undefined`

但我仅仅改个名字：

```javascript

requirejs.config({
	baseUrl: '/public/js',
	paths: {
		jquery: 'lib/jquery/jquery'
	}
});

requirejs(['jquery'],function(jq) {
	alert(jq);
});

```

就一切正常了，能打印出jq相应的对象。

#### 有主的模块

经常研究，发现原来在jquery中已经定义了：

`define('jquery,[],function(){ .. }');`

它这里的define跟我们前面看到的 app.js 不同，在于它多了第一个参数 'jquery'，表示给当前这个模块起了个名字 jquery，它已经是有主的了，只能属于jquery。

多以当我们使用另一个名字:

`myjquery: 'lib/jquery/jquery'`

去引用这个库的时候，它会发现，在jquery.js里声明的模块名 jquery 与我自己使用的模块名 myjquery 不能，便不会把它赋给 myjquery，所以 myjquery 的值是 undefined。

#### 无主的模块

如果我们不指明模块名，就像这样：

```javascript

define([...],function(){
	...
});

```

那么它就是无主的模块，我们可以在 requirejs.config 里，使用任意一个模块名来引用它。这样的话，就让我们的命名非常自由，大部分模块就是无主的。

#### 为什么有的有主，有的无主

可以看到，无主的模块使用起来非常自由，为什么某些库(jquery,underscore)要把自己生命为有主的。

按某种说法，这么做是出于性能的考虑，因为像 jquery,underscore 这样的基础库，经常被其他库依赖。如果声明为无主，那么其他库很可能起不容的模块名，这样我们使用它们时，就可能会多次载入 jquery/underscore

而把它们声明为有主的，那么所有的模块只能使用同一个名字引用它们，这样系统就只会载入它们一次。

对于有主的模块，我们还有一种方式可以挖墙脚，不把它们当做满足 require规范的模块，而是当做普通js库，然后再 shim中导出它们定义的全局变量。

```javascript

requirejs.config({
	baseUrl: '/public/js',
	paths: {
		myjquery: 'lib/jquery/jquery'
	},
	shim: {
		myjquery: { exports: 'jQuery'}
	}
});

requirejs(['myjquery'],function(jq){
	alert(jq);
});

```

#### 如何完全不让jquery污染全局的$

在前面引用jquery的这种方式中，我们虽然可以以模块的方式拿到jquery模块的引用，但是还是可以在任何地方使用全局变量 jQuery 和 & 。 有没有办法让jquery完全不污染者两个变量?