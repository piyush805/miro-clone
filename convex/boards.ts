import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAllOrThrow } from "convex-helpers/server/relationships";

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    let boards = [];

    if (args.favorites) {
      // get all favorited boards for this user in this org
      const favoritedBoards = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_org", (q) =>
          q.eq("userId", identity.subject).eq("orgId", args.orgId)
        )
        .order("desc")
        .collect();

      const ids = favoritedBoards.map((b) => b.boardId); // get all favorited board ids

      boards = await getAllOrThrow(ctx.db, ids); // get all those boards from boards table
      // mark them as favorited

      return boards.map((board) => ({
        ...board,
        isFavorite: true, // these are loaded from favoriteBoards only
      }));
    }

    const title = args.search?.trim() as string;

    if (title) {
      // TODO: Query with search index
      boards = await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) =>
          q.search("title", title).eq("orgId", args.orgId)
        )
        .collect();
    } else {
      boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .collect();
    }

    const boardsWithFavoriteRelation = boards.map((board) => {
      return ctx.db
        .query("userFavorites")
        .withIndex("by_user_board", (q) =>
          q.eq("userId", identity.subject).eq("boardId", board._id)
        )
        .unique()
        .then((favorite) => {
          return { ...board, isFavorite: !!favorite };
        });
    });
    const boardsWithFavoriteBoolean = await Promise.all(
      // because mapping over mapping and async query over each board will return promises
      boardsWithFavoriteRelation
    );
    return boardsWithFavoriteBoolean;
  },
});
