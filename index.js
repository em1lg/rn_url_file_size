import {URL} from 'react-native-url-polyfill';

/**
 * Get file size from URL (in bytes) without downloading it.
 * @param {(string|URL)} url URL to get file size from
 * @param {number} [timeout=10000] Timeout in milliseconds
 * @param {number} [maxRedirects=5] Maximum number of redirects to follow
 * @return {Promise<number>} File size in bytes
 */
const rnufs = (url, timeout = 10000, maxRedirects = 5) => {
    return new Promise((res, rej) => {
        if (url instanceof URL) {
            url = url.toString();
        }
        if (typeof url !== 'string') {
            rej(new TypeError('url must be a string or instance of URL'));
        }
        if (typeof timeout !== 'number') {
            rej(new TypeError('timeout must be a number'));
        }
        if (typeof maxRedirects !== 'number') {
            rej(new TypeError('maxRedirects must be a number'));
        }
        if (maxRedirects < 0) {
            rej(new Error('maxRedirects must be greater than 0'));
        }

        const controller = new AbortController();
        const signal = controller.signal;
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        fetch(url, {method: 'HEAD', signal})
            .then(response => {
                clearTimeout(timeoutId);
                if (
                    response.status >= 300 &&
                    response.status < 400 &&
                    response.headers.get('location')
                ) {
                    if (maxRedirects === 0) {
                        return rej(new Error('Too many redirects'));
                    }
                    return res(
                        ufs(response.headers.get('location'), timeout, maxRedirects - 1),
                    );
                }
                const contentLength = response.headers.get('content-length');
                if (contentLength) {
                    res(parseInt(contentLength, 10));
                } else {
                    rej("Couldn't get file size");
                }
            })
            .catch(error => {
                if (error.name === 'AbortError') {
                    rej(new Error('Request timed out'));
                } else {
                    rej(error);
                }
            });
    });
};

export default rnufs;
