if exists('g:loaded_fall_source_mr')
  finish
endif
let g:loaded_fall_source_mr = 1

let s:root = expand('<sfile>:p:h:h')
let s:base = fall#path#join([s:root, 'denops', '@fall', 'mr'])

call fall#extension#register(#{
      \  mrr: fall#path#join([s:base, 'source', 'mrr.ts']),
      \  mru: fall#path#join([s:base, 'source', 'mru.ts']),
      \  mrw: fall#path#join([s:base, 'source', 'mrw.ts']),
      \})


