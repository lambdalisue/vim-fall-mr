import type { Source } from "https://deno.land/x/fall_core@v0.8.0/mod.ts";
import { assert, is } from "jsr:@core/unknownutil@3.18.0";

const isOptions = is.StrictOf(is.PartialOf(is.ObjectOf({})));

export function getSource(
  options: Record<string, unknown>,
): Source {
  assert(options, isOptions);
  return {
    getStream: async (denops, _cmdline) => {
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
}
