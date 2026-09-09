import { ReactNode } from "react";

import { Contract } from "ethers";

export type LocalesType = "en" | "zh" | "ja" | "ko";
export interface RouteObjects {
  // 让不让menu读取
  menuReady?: boolean;
  name?: string;
  // 你懂的
  children?: RouteObjects[];
  // 你懂的
  element?: React.ReactNode;
  // 你懂的
  path?: string;
  // 权限校验
  auth?: boolean;
}
export type objKeyObjectType = {
  [key: string]: Contract | null;
  erc20: Contract | null;
  doubleStaking: Contract | null;
  token: Contract | null;
};

export interface numKeyObj {
  [key: number]: { chainName: string; symbol: string; chainID: number };
}
export interface strKeyReactNode {
  [key: string]: ReactNode;
}
export interface strKeyStr {
  [key: string]: string;
}
// axios 返回的数据格式
export interface MyResponseType<T> {
  code: number;
  msg: string;
  data: T;
}
export interface RawStakeType {
  id: bigint;
  wfiboAmount: bigint;
  usdtAmount: bigint;
  lpAmount: bigint;
  startTime: bigint;
  lockEndTime: bigint;
  unlockCycleDay: bigint;
  isWithdraw: boolean;
}

export interface ReferralRewardsType {
  index: number;
  referrer: string;
  lpAmount: bigint;
  timestamp: bigint;
}
export interface LevelRewardType {
  index: number;
  ftokenAmount: bigint;
  timestamp: bigint;
}
export interface UserInfoType {
  referrer: string;
  start: bigint;
  curLevel: bigint;
  bestLevel: bigint;
  totalStake: bigint;
  totalLP: bigint;
  bestLink: string;
}
