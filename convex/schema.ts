import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const schema = defineSchema({
  documents: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.optional(v.string()),
    icon: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    parentDocumentId: v.optional(v.id('documents')),
    isArchived: v.boolean(),
    isPublished: v.boolean(),
  })
    .index('by_user', ['userId'])
    .index('by_user_parent', ['userId', 'parentDocumentId']),
});

export default schema;
