import type { GetSource } from "jsr:@lambdalisue/vim-fall@0.6.0/source";
import { assert, is } from "jsr:@core/unknownutil@3.18.0";

const isType = is.LiteralOneOf(["mru", "mrw", "mrr"] as const);

const isOptions = is.StrictOf(is.PartialOf(is.ObjectOf({
  type: isType,
})));

export const getSource: GetSource = (denops, options) => {
  assert(options, isOptions);
  const type = options.type ?? "mru";
  return {
    description: `Get the MRU/MRW/MRR list from vim-mr`,
    async stream() {
      const paths = await denops.call(`mr#${type}#list`) as string[];
      return ReadableStream.from(paths).pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            controller.enqueue({
              value: chunk,
              detail: {
                path: chunk,
                mr: {
                  type,
                  path: chunk,
                },
              },
            });
          },
        }),
      );
    },
  };
};
