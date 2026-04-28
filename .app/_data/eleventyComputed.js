import { isDraft } from "../lib/shared/is-draft.js";

export default {
  layout(data) {
    if (isDraft(data)) return false;
    return data.layout;
  },

  permalink(data) {
    if (isDraft(data)) return false;
    return data.permalink;
  },
};
