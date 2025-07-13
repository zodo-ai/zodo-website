export interface HeadersI extends Record<string, string> {
    'X-Powered-By': string;
    'Access-Control-Allow-Origin': string;
    'Content-Type': string;
    'Content-Length': string;
    'ETag': string;
    'Date': string;
    'Connection': string;
    'Keep-Alive': string;
}

export type MethodI = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface APICallI<PayloadT = unknown> {
    payload?: PayloadT;
    query?: Record<string, string | number | boolean>;
    routeId?: string;
    headers?: Partial<HeadersI>;
}

export interface GenerateUrlOptions {
    baseUrl: string;
    path: string;
    query?: Record<string, string | number | boolean>;
    routeId?: string;
}

export class APIResError extends Error {
    constructor(
        public status: number,
        public response: any,
        message?: string
    ) {
        super(message || `API Error: ${status}`);
        this.name = 'APIResError';
    }
}

export class AppError extends Error {
    constructor(message: string, public originalError?: Error) {
        super(message);
        this.name = 'AppError';
    }
}

const Config = {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://api.zodoai.com',
};

const BASE_URL = Config.BASE_URL;

const isFilled = (value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
};

const generateUrl = ({ baseUrl, path, query, routeId }: GenerateUrlOptions): string => {
    let url = `${baseUrl}${path}`;
    
    if (routeId) {
        url = url.replace(':id', routeId);
    }
    
    if (query && Object.keys(query).length > 0) {
        const queryParams = new URLSearchParams();
        Object.entries(query).forEach(([key, value]) => {
            queryParams.append(key, String(value));
        });
        url += `?${queryParams.toString()}`;
    }
    
    return url;
};

const getHeaders = (): HeadersI => ({
    'X-Powered-By': 'Express',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': '794',
    'ETag': 'W/"31a-Jkr73O2ABhHARa176dQQxOfY+fY"',
    'Date': new Date().toUTCString(),
    'Connection': 'keep-alive',
    'Keep-Alive': 'timeout=5',
});

// Main API call function
export const apiCall = async <PayloadT = unknown, ResponseT = unknown>(
    path: string,
    method: MethodI,
    { payload, query, routeId, headers }: APICallI<PayloadT> = {},
): Promise<ResponseT> => {
    try {
        const url = generateUrl({
            baseUrl: BASE_URL,
            path,
            query,
            routeId,
        });

        let baseHeaders = getHeaders();

        if (isFilled(headers) && headers) {
            const filteredHeaders = Object.entries(headers).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {} as Record<string, string>);

            baseHeaders = { ...baseHeaders, ...filteredHeaders };
        }

        const options: RequestInit = {
            headers: baseHeaders,
            method,
        };

        if (isFilled(payload)) {
            options.body = JSON.stringify(payload);
        }

        const response = await fetch(url, options);

        const contentType = response.headers.get('content-type');
        const isJson = contentType?.includes('application/json');
        const json = isJson ? await response.json() : null;
        
        if (response.status >= 200 && response.status < 300) {
            return json as ResponseT;
        }

        throw new APIResError(response.status, json || { message: 'No response body' });
    } catch (error) {
        if (error instanceof APIResError) {
            throw error;
        } else if (error instanceof TypeError) {
            throw error;
        }
        throw new AppError('Unknown error', error as Error);
    }
};
