import Cookies from 'js-cookie';
declare const useCookie: (cookieName: string) => [string | null, (newValue: string, options?: Cookies.CookieAttributes | undefined) => void, () => void];
export default useCookie;
