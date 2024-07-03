(module
 (type $0 (func (param i32 i32) (result i32)))
 (global $~lib/memory/__data_end i32 (i32.const 8))
 (global $~lib/memory/__stack_pointer (mut i32) (i32.const 32776))
 (global $~lib/memory/__heap_base i32 (i32.const 32776))
 (memory $0 0)
 (table $0 1 1 funcref)
 (elem $0 (i32.const 1))
 (export "add" (func $Frontend/assembly/index/add))
 (export "subtract" (func $Frontend/assembly/index/subtract))
 (export "multiply" (func $Frontend/assembly/index/multiply))
 (export "divide" (func $Frontend/assembly/index/divide))
 (export "remainder" (func $Frontend/assembly/index/remainder))
 (export "power" (func $Frontend/assembly/index/power))
 (export "memory" (memory $0))
 (func $Frontend/assembly/index/add (param $a i32) (param $b i32) (result i32)
  local.get $a
  local.get $b
  i32.add
  return
 )
 (func $Frontend/assembly/index/subtract (param $a i32) (param $b i32) (result i32)
  local.get $a
  local.get $b
  i32.sub
  return
 )
 (func $Frontend/assembly/index/multiply (param $a i32) (param $b i32) (result i32)
  local.get $a
  local.get $b
  i32.mul
  return
 )
 (func $Frontend/assembly/index/divide (param $a i32) (param $b i32) (result i32)
  local.get $a
  local.get $b
  i32.div_s
  return
 )
 (func $Frontend/assembly/index/remainder (param $a i32) (param $b i32) (result i32)
  local.get $a
  local.get $b
  i32.rem_s
  return
 )
 (func $Frontend/assembly/index/power (param $a i32) (param $b i32) (result i32)
  local.get $b
  i32.const 0
  i32.eq
  if
   i32.const 1
   return
  end
  local.get $a
  i32.const 0
  i32.eq
  if
   i32.const 0
   return
  end
  local.get $a
  local.get $a
  local.get $b
  i32.const 1
  i32.sub
  call $Frontend/assembly/index/power
  i32.mul
  return
 )
)
