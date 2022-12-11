

export const prerender = false;

/** @type {import('./$types').RequestHandler} */

export async function GET({request}: {request: any}) {
    let res = {
        ip: request.headers.get('x-forwarded-for')?.split(',')[0]
    }
    return new Response(JSON.stringify(res))
}