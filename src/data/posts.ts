import { Collection } from "@msw/data";
import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

export const postSchema = v.object({
	id: v.number(),
	title: v.string(),
	body: v.string(),
});

export type Post = v.InferOutput<typeof postSchema>;

const posts = new Collection({
	schema: postSchema,
});

let id = 0;
const nextId = () => id++;

export const getPosts = createServerFn().handler((): Post[] =>
	posts.findMany(),
);

export const createPost = createServerFn()
	.inputValidator(v.omit(postSchema, ["id"]))
	.handler(
		({ data }): Promise<Post> =>
			posts.create({
				id: nextId(),
				...data,
			}),
	);

export const updatePost = createServerFn()
	.inputValidator(v.required(v.partial(postSchema), ["id"]))
	.handler(({ data: { id, ...patch } }) => {
		posts.update((q) => q.where({ id }), {
			data(draft) {
				Object.assign(draft, patch);
			},
		});
	});

export const deletePost = createServerFn()
	.inputValidator(v.pick(postSchema, ["id"]))
	.handler(({ data: { id } }) => {
		posts.delete((q) => q.where({ id }));
	});
