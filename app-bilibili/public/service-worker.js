import { get } from '../src/api/http.ts';
// service-worker.js
self.addEventListener('fetch', async event => {
    const url = event.request.url;
    const check = ['static.geetest', 'static.geevisit', 'api.geetest'];
    const isInclude = check.some(value => url.includes(value));
    console.log(isInclude);
    // 检查请求的 URL 是否匹配
    if (isInclude) {
        console.log('Intercepted request to:', url);
      
        event.respondWith(
            (async () => {
                try {
                    // 创建一个新的请求，将其转发到代理服务器
                    const response = await get({
                        url: '/user/login/geetest/proxy',
                        data: {
                            url
                        }
                    });

                    // 返回响应，确保格式正确
                    return new Response(response.data, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: new Headers(response.headers)
                    });
                } catch (error) {
                    console.error('Error fetching from proxy:', error);
                    return new Response('Error fetching from proxy', { status: 500 });
                }
            })()
        );
    };
});