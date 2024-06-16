export type ServerResponse = {
    "statusCode": string
}

export async function request<TResponse>(
    url: string,
    config: RequestInit = {},
    parse: boolean
):Promise<TResponse> {
    return fetch(url, config)
        .then((response) => response.json()
        )
        .then((response) => response as TResponse);
}