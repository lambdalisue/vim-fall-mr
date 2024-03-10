import type { Source } from "https://deno.land/x/fall_core@v0.3.0/mod.ts";
import { assert, is } from "https://deno.land/x/unknownutil@v3.16.3/mod.ts";

const isOptions = is.StrictOf(is.PartialOf(is.ObjectOf({})));

export function getSource(
  options: Record<string, unknown>,
): Source {
  assert(options, isOptions);
  return {
    getStream: async (denops, ..._args: string[]) => {
      const paths = await denops.call("mr#mrr#list") as string[];
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
}
