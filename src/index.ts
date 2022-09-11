import { v4 as uuidv4 } from "uuid"
/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// These initial Types are based on bindings that don't exist in the project yet,
// you can follow the links to learn how to implement them.

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket
  CART: KVNamespace;
}
export interface ExecutionContext {
	parames: string[]
}
export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
    const formData = await request.formData();
    const entries = formData.entries();
    const cookie = await getCookie(request.headers);
    for(const entry of entries) {
      if (typeof(entry[1]) === "string") {
        await setProductCart(env.CART, { key: entry[0], value: entry[1] });
        const result = await getProductCart(env.CART, entry[0]);
        console.log(result);
      }
    }
    for(const entry of entries) {
      const result = await getProductCart(env.CART, entry[0]);
    }
		return new Response(`Hello World from ${request.method}!`);
	},
};

const setProductCart = async (CART: KVNamespace, params: { key: string, value: string }) => {
  return await CART.put(params.key, params.value);
}

const getProductCart = async (CART: KVNamespace, key: string) => {
  return await CART.get(key);
}

const getCookie = async (headers: Headers) => {
  if(!headers.has("uid")){
    return uuidv4();
  } 
  return headers.get("uid");  
}
