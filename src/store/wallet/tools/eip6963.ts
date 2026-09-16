/** EIP-1193 provider 的最小运行时接口；EIP-6963 仅负责发现钱包。 */
export interface Eip1193Provider {
  request: (args: {
    method: string;
    params?: readonly unknown[] | object;
  }) => Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (
    event: string,
    listener: (...args: unknown[]) => void,
  ) => void;
}

export interface Eip6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface Eip6963ProviderDetail {
  info: Eip6963ProviderInfo;
  provider: Eip1193Provider;
}

type ProviderListener = (providers: Eip6963ProviderDetail[]) => void;

const providers = new Map<string, Eip6963ProviderDetail>();
const listeners = new Set<ProviderListener>();
let isDiscoveryStarted = false;

const isProviderDetail = (value: unknown): value is Eip6963ProviderDetail => {
  if (!value || typeof value !== "object") return false;

  const detail = value as Partial<Eip6963ProviderDetail>;
  return Boolean(
    detail.info &&
    typeof detail.info.uuid === "string" &&
    typeof detail.info.name === "string" &&
    typeof detail.info.icon === "string" &&
    typeof detail.info.rdns === "string" &&
    detail.provider &&
    typeof detail.provider.request === "function",
  );
};

const getProviders = () => Array.from(providers.values());

const notifyListeners = () => {
  const announcedProviders = getProviders();
  listeners.forEach((listener) => listener(announcedProviders));
};

const announceProvider = (event: Event) => {
  const detail = (event as CustomEvent<unknown>).detail;
  if (!isProviderDetail(detail) || providers.has(detail.info.uuid)) return;

  // 某些钱包 WebView 会针对同一个钱包重复公告，并且 UUID 可能不同。
  // rdns 是钱包的稳定标识；按它去重，避免钱包选择列表出现多个 TP 钱包。
  const hasSameRdns = Array.from(providers.values()).some(
    ({ info }) => info.rdns === detail.info.rdns,
  );
  if (hasSameRdns) return;

  providers.set(detail.info.uuid, detail);
  notifyListeners();
};

/** 先监听再请求公告，避免遗漏钱包扩展早于页面加载时的注入。 */
export const startEip6963Discovery = () => {
  if (typeof window === "undefined" || isDiscoveryStarted) return;

  window.addEventListener("eip6963:announceProvider", announceProvider);
  isDiscoveryStarted = true;
  requestEip6963Providers();
};

export const requestEip6963Providers = () => {
  if (typeof window === "undefined") return;

  startEip6963Discovery();
  window.dispatchEvent(new Event("eip6963:requestProvider"));
};

export const subscribeEip6963Providers = (listener: ProviderListener) => {
  startEip6963Discovery();
  listeners.add(listener);
  listener(getProviders());

  return () => listeners.delete(listener);
};

export const findEip6963Provider = (uuid: string) => providers.get(uuid);

export const getEip6963Providers = () => getProviders();
