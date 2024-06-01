import type { GetSource } from "jsr:@lambdalisue/vim-fall@0.6.0/source";

export const getSource: GetSource = (denops) => {
  return {
    async stream() {
      const paths = await denops.call("mr#mrw#list") as string[];
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
