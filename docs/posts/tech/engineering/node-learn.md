---
date: 2025-12-24
---

# Node编译

## 编译Node
node的编译都在BUILDING文档中列举了具体要求，在Macos章节的Building Nodejs里说明了如何编译。


### 问题1: V8编译错误
目测是因为c++版本问题. 
试了下`clang --version`，电脑上装的是16，要求在configure文件里有，  
`warn(f"C++ compiler (CXX={CXX}, {version_str}) too old, need g++ 12.2.0 or clang++ 19.1.0{' or Apple clang++ 17.0.0' if is_apple else ''}")`  
需要更新下clang
```
clang --version
Apple clang version 16.0.0 (clang-1600.0.26.6)
Target: arm64-apple-darwin25.0.0
Thread model: posix
```
手动下一下llvm `brew install llvm`  
配置环境变量
```
echo 'export CXX=/opt/homebrew/opt/llvm/bin/clang++' >> ~/.zshrc && echo 'export CC=/opt/homebrew/opt/llvm/bin/clang' >> ~/.zshrc
```
error log:

```
../deps/v8/src/base/atomicops.h:81:8: error: no member named 'atomic_ref' in namespace 'std'
   81 |   std::atomic_ref<T>(*ptr).compare_exchange_strong(old_value, new_value,
      |   ~~~~~^
../deps/v8/src/base/atomicops.h:81:19: error: 'T' does not refer to a value
   81 |   std::atomic_ref<T>(*ptr).compare_exchange_strong(old_value, new_value,
      |                   ^
../deps/v8/src/base/atomicops.h:77:42: note: declared here
   77 | template <AtomicTypeForTrivialOperations T>
      |                                          ^
../deps/v8/src/base/atomicops.h:90:8: error: no member named 'atomic_ref' in namespace 'std'
   90 |   std::atomic_ref<T>(*ptr).compare_exchange_strong(old_value, new_value,
      |   ~~~~~^
../deps/v8/src/base/atomicops.h:90:19: error: 'T' does not refer to a value
   90 |   std::atomic_ref<T>(*ptr).compare_exchange_strong(old_value, new_value,
      |                   ^
../deps/v8/src/base/atomicops.h:86:42: note: declared here
   86 | template <AtomicTypeForTrivialOperations T>
      |                                          ^
../deps/v8/src/base/atomicops.h:100:8: error: no member named 'atomic_ref' in namespace 'std'
  100 |   std::atomic_ref<T>(*ptr).compare_exchange_strong(old_value, new_value,
      |   ~~~~~^
../deps/v8/src/base/atomicops.h:100:19: error: 'T' does not refer to a value
  100 |   std::atomic_ref<T>(*ptr).compare_exchange_strong(old_value, new_value,
      |                   ^
../deps/v8/src/base/atomicops.h:96:42: note: declared here
   96 | template <AtomicTypeForTrivialOperations T>
      |                                          ^
../deps/v8/src/base/atomicops.h:110:8: error: no member named 'atomic_ref' in namespace 'std'
  110 |   std::atomic_ref<T>(*ptr).compare_exchange_strong(old_value, new_value,
      |   ~~~~~^
../deps/v8/src/base/atomicops.h:110:19: error: 'T' does not refer to a value
  110 |   std::atomic_ref<T>(*ptr).compare_exchange_strong(old_value, new_value,
      |                   ^
../deps/v8/src/base/atomicops.h:106:42: note: declared here
  106 | template <AtomicTypeForTrivialOperations T>
      |                                          ^
../deps/v8/src/base/atomicops.h:119:15: error: no member named 'atomic_ref' in namespace 'std'
  119 |   return std::atomic_ref<T>(*ptr).exchange(new_value,
      |          ~~~~~^
../deps/v8/src/base/atomicops.h:119:26: error: 'T' does not refer to a value
  119 |   return std::atomic_ref<T>(*ptr).exchange(new_value,
      |                          ^
../deps/v8/src/base/atomicops.h:116:42: note: declared here
  116 | template <AtomicTypeForTrivialOperations T>
      |                                          ^
../deps/v8/src/base/atomicops.h:126:15: error: no member named 'atomic_ref' in namespace 'std'
  126 |   return std::atomic_ref<T>(*ptr).exchange(new_value,
      |          ~~~~~^
../deps/v8/src/base/atomicops.h:126:26: error: 'T' does not refer to a value
  126 |   return std::atomic_ref<T>(*ptr).exchange(new_value,
      |                          ^
../deps/v8/src/base/atomicops.h:123:42: note: declared here
  123 | template <AtomicTypeForTrivialOperations T>
      |                                          ^
../deps/v8/src/base/atomicops.h:133:15: error: no member named 'atomic_ref' in namespace 'std'
  133 |   return std::atomic_ref<T>(*ptr).fetch_or(bits, std::memory_order_relaxed);
      |          ~~~~~^
../deps/v8/src/base/atomicops.h:133:26: error: 'T' does not refer to a value
  133 |   return std::atomic_ref<T>(*ptr).fetch_or(bits, std::memory_order_relaxed);
      |                          ^
../deps/v8/src/base/atomicops.h:130:42: note: declared here
  130 | template <AtomicTypeForTrivialOperations T>
      |                                          ^
../deps/v8/src/base/atomicops.h:139:27: error: no member named 'atomic_ref' in namespace 'std'
  139 |   return increment + std::atomic_ref<T>(*ptr).fetch_add(
      |                      ~~~~~^
../deps/v8/src/base/atomicops.h:139:38: error: 'T' does not refer to a value
  139 |   return increment + std::atomic_ref<T>(*ptr).fetch_add(
      |                                      ^
../deps/v8/src/base/atomicops.h:136:42: note: declared here
  136 | template <AtomicTypeForTrivialOperations T>
      |                                          ^
../deps/v8/src/base/atomicops.h:145:8: error: no member named 'atomic_ref' in namespace 'std'
  145 |   std::atomic_ref<T>(*ptr).store(value, std::memory_order_relaxed);
      |   ~~~~~^
../deps/v8/src/base/atomicops.h:145:19: error: 'T' does not refer to a value
  145 |   std::atomic_ref<T>(*ptr).store(value, std::memory_order_relaxed);
      |                   ^
../deps/v8/src/base/atomicops.h:143:42: note: declared here
  143 | template <AtomicTypeForTrivialOperations T>
      |                                          ^
../deps/v8/src/base/atomicops.h:150:8: error: no member named 'atomic_ref' in namespace 'std'
  150 |   std::atomic_ref<T>(*ptr).store(value, std::memory_order_release);
      |   ~~~~~^
fatal error: too many errors emitted, stopping now [-ferror-limit=]
20 errors generated.
make[1]: *** [/Users/chenkaiming/project/node/out/Release/obj.target/v8_libplatform/deps/v8/src/libplatform/tracing/tracing-controller.o] Error 1
make[1]: *** Waiting for unfinished jobs....
make: *** [node] Error 2
```


### 问题2: symbol(s) not found for architecture arm64
上一步下载了最新版llvm，结果太新，链接时用的macos系统的libc++，结果太老了没有这些符号。降低一下llvm版本(llvm@19)。

```
Undefined symbols for architecture arm64:
  "std::__1::__hash_memory(void const*, unsigned long)", referenced from:
      std::__1::pair<std::__1::__hash_iterator<std::__1::__hash_node<std::__1::__hash_value_type<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>>, void*>*>, bool> std::__1::__hash_table<std::__1::__hash_value_type<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>>, std::__1::__unordered_map_hasher<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>, std::__1::pair<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>> const, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>>, std::__1::hash<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>>, std::__1::equal_to<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>>, true>, std::__1::__unordered_map_equal<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>, std::__1::pair<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>> const, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>>, std::__1::equal_to<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>>, std::__1::hash<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>>, true>, std::__1::allocator<std::__1::pair<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>> const, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>>>>::__emplace_unique_key_args<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>&>(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>> const&, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>&&, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char>>&) in util.o
ld: symbol(s) not found for architecture arm64
```
### 问题3: flag配置问题
又遇到了问题1的问题，不过不是clang问题了，而是没配c++20导致的，node最新版要求c++20。  
`export CXXFLAGS="-std=c++20"`解决



## 学习过程
### `./configure --debug`是做什么的
运行这个文件，主要会(1)检查系统环境，例如python/clang等编译器环境是否支持;(2)生成构建配置`config.gypi`文件;(3)调试模式的调试符号等;(4)根据平台配置V8等子模块。