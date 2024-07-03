(module
 (type $0 (func (param i32 i32) (result i32)))
 (memory $0 0)
 (export "add" (func $Frontend/assembly/index/add))
 (export "subtract" (func $Frontend/assembly/index/subtract))
 (export "multiply" (func $Frontend/assembly/index/multiply))
 (export "divide" (func $Frontend/assembly/index/divide))
 (export "remainder" (func $Frontend/assembly/index/remainder))
 (export "power" (func $Frontend/assembly/index/power))
 (export "memory" (memory $0))
 (func $Frontend/assembly/index/add (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  i32.add
 )
 (func $Frontend/assembly/index/subtract (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  i32.sub
 )
 (func $Frontend/assembly/index/multiply (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  i32.mul
 )
 (func $Frontend/assembly/index/divide (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  i32.div_s
 )
 (func $Frontend/assembly/index/remainder (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  i32.rem_s
 )
 (func $Frontend/assembly/index/power (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  i32.eqz
  if
   i32.const 1
   return
  end
  local.get $0
  i32.eqz
  if
   i32.const 0
   return
  end
  local.get $0
  local.get $1
  i32.const 1
  i32.sub
  call $Frontend/assembly/index/power
  local.get $0
  i32.mul
 )
)
