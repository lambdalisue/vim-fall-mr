import type { GetAction } from "jsr:@lambdalisue/vim-fall@0.6.0/action";
import { is } from "jsr:@core/unknownutil@3.18.0";

const isType = is.LiteralOneOf(["mru", "mrw", "mrr"] as const);

const isMrDetail = is.ObjectOf({
  mr: is.ObjectOf({
    type: isType,
    path: is.String,
  }),
});

export const getAction: GetAction = (denops) => {
  return {
    description: "Delete the cursor or selected item(s) from MRU/MRW/MRR list",

    async invoke({ cursorItem, selectedItems }, { signal }) {
      const items = selectedItems.length > 0
        ? selectedItems
        : cursorItem
        ? [cursorItem]
        : [];
      for (const item of items) {
        signal?.throwIfAborted();
        if (!isMrDetail(item.detail)) {
          continue;
        }
        await denops.call(
          `mr#${item.detail.mr.type}#delete`,
          item.detail.mr.path,
        );
      }
    },
  };
};
