import { Collection } from "@msw/data";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
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

await posts.createMany(5, () => {
	const id = nextId();
	return {
		id,
		title: `Post ${id}`,
		body: `This is post ${id}`,
	};
});

export const getPostsFn = createServerFn().handler((): Post[] => posts.all());
export const getPosts = queryOptions({
	queryKey: ["posts"],
	queryFn: getPostsFn,
});

export const createPostFn = createServerFn()
	.inputValidator(v.omit(postSchema, ["id"]))
	.handler(
		({ data }): Promise<Post> =>
			posts.create({
				id: nextId(),
				...data,
			}),
	);
export const createPost = mutationOptions({
	mutationFn: createPostFn,
	onSuccess: (_data, _variables, _onMutateResult, context) => {
		context.client.invalidateQueries({
			queryKey: ["posts"],
		});
	},
});

export const updatePostFn = createServerFn()
	.inputValidator(v.required(v.partial(postSchema), ["id"]))
	.handler(
		({ data: { id, ...patch } }): Promise<Post | undefined> =>
			posts.update((q) => q.where({ id }), {
				data(draft) {
					Object.assign(draft, patch);
				},
			}),
	);
export const updatePost = mutationOptions({
	mutationFn: updatePostFn,
	onSuccess: (_data, _variables, _onMutateResult, context) => {
		context.client.invalidateQueries({
			queryKey: ["posts"],
		});
	},
});

export const deletePostFn = createServerFn()
	.inputValidator(v.pick(postSchema, ["id"]))
	.handler(({ data: { id } }) => {
		posts.delete((q) => q.where({ id }));
	});
export const deletePost = mutationOptions({
	mutationFn: deletePostFn,
	onSuccess: (_data, _variables, _onMutateResult, context) => {
		context.client.invalidateQueries({
			queryKey: ["posts"],
		});
	},
});
