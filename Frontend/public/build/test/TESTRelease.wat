(module
 (type $0 (func (param i32)))
 (type $1 (func (param i32 i32 i32 i32)))
 (type $2 (func))
 (import "env" "console.log" (func $~lib/bindings/dom/console.log (param i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $~lib/memory/__stack_pointer (mut i32) (i32.const 33852))
 (memory $0 1)
 (data $0 (i32.const 1036) ",")
 (data $0.1 (i32.const 1048) "\02\00\00\00\1a\00\00\00H\00e\00l\00l\00o\00,\00 \00W\00o\00r\00l\00d\00!")
 (export "main" (func $assembly/Index/main))
 (export "memory" (memory $0))
 (func $assembly/Index/main
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 1084
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   i32.const 1056
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 1056
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 1084
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 1056
   i32.store
   i32.const 1056
   call $~lib/bindings/dom/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  i32.const 33872
  i32.const 33920
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
)
