import type { GetSource } from "jsr:@lambdalisue/vim-fall@0.6.0/source";
import { assert, is } from "jsr:@core/unknownutil@3.18.0";

const isOptions = is.StrictOf(is.PartialOf(is.ObjectOf({})));

export const getSource: GetSource = (denops, options) => {
  assert(options, isOptions);
  return {
    async stream() {
      const paths = await denops.call("mr#mru#list") as string[];
      return ReadableStream.from(paths).pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            controller.enqueue({
              value: chunk,
              detail: { path: chunk },
            });
          },
        }),
      );
    },
  };
};
